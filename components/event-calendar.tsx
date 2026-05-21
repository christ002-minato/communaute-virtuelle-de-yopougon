'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface CalendarEvent {
  id: string
  title: string
  date: string // format: YYYY-MM-DD
  time: string
  location: string
  type: 'cours' | 'formation' | 'sport' | 'detente'
  description?: string
}

interface EventCalendarProps {
  events: CalendarEvent[]
}

const eventTypeColors = {
  cours: { bg: 'bg-blue-500', text: 'text-blue-500', label: 'Cours de soutien' },
  formation: { bg: 'bg-green-600', text: 'text-green-600', label: 'Formation spéciale' },
  sport: { bg: 'bg-red-500', text: 'text-red-500', label: 'Journée sportive' },
  detente: { bg: 'bg-yellow-500', text: 'text-yellow-500', label: 'Sortie détente' },
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7 // Monday = 0
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.date === dateStr)
  }

  const handleEventHover = (event: CalendarEvent, e: React.MouseEvent) => {
    setHoveredEvent(event)
    setTooltipPosition({ x: e.clientX, y: e.clientY })
  }

  const days: (number | null)[] = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-lg font-semibold text-foreground">
          {MONTHS[month]} {year}
        </h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        {Object.entries(eventTypeColors).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${value.bg}`} />
            <span className="text-muted-foreground">{value.label}</span>
          </div>
        ))}
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = day ? getEventsForDay(day) : []
          const isToday = day === new Date().getDate() && 
                          month === new Date().getMonth() && 
                          year === new Date().getFullYear()
          
          return (
            <div
              key={index}
              className={`min-h-[60px] md:min-h-[80px] p-1 border border-border rounded-lg ${
                day ? 'bg-card' : 'bg-transparent'
              } ${isToday ? 'ring-2 ring-primary' : ''}`}
            >
              {day && (
                <>
                  <div className={`text-xs font-medium mb-1 ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`${eventTypeColors[event.type].bg} text-white text-[10px] px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity`}
                        onMouseEnter={(e) => handleEventHover(event, e)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-muted-foreground">
                        +{dayEvents.length - 2} autres
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Tooltip */}
      {hoveredEvent && (
        <div
          className="fixed z-50 bg-card border border-border rounded-lg shadow-lg p-3 max-w-[250px] pointer-events-none"
          style={{
            left: Math.min(tooltipPosition.x + 10, window.innerWidth - 260),
            top: tooltipPosition.y + 10,
          }}
        >
          <div className={`text-sm font-semibold ${eventTypeColors[hoveredEvent.type].text}`}>
            {hoveredEvent.title}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {eventTypeColors[hoveredEvent.type].label}
          </div>
          <div className="flex items-center gap-1 text-xs text-foreground mt-2">
            <Clock className="w-3 h-3" />
            {hoveredEvent.time}
          </div>
          <div className="flex items-center gap-1 text-xs text-foreground mt-1">
            <MapPin className="w-3 h-3" />
            {hoveredEvent.location}
          </div>
          {hoveredEvent.description && (
            <p className="text-xs text-muted-foreground mt-2">{hoveredEvent.description}</p>
          )}
        </div>
      )}
    </div>
  )
}
