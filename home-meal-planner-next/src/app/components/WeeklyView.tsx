'use client'
import { useState } from 'react'
import { useAppState } from '../AppStateContext'
import { WeekCard } from './WeekCard'
import { Button } from './Button'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { DateNavContainer } from './DateNavContainer'

interface Week {
  weekNumber: number
  start: Date
  end: Date
  idx: number
  key: string
}

interface WeeklyViewProps {
  weeks: Week[]
}

export default function WeeklyView({ weeks }: WeeklyViewProps) {
  const { selectedWeekIdx, setSelectedWeekIdx } = useAppState()
  const [currentWeekIdx, setCurrentWeekIdx] = useState(selectedWeekIdx)

  const handlePrevWeek = () => {
    const newIdx = Math.max(0, currentWeekIdx - 1)
    setCurrentWeekIdx(newIdx)
    setSelectedWeekIdx(newIdx)
  }

  const handleNextWeek = () => {
    const newIdx = Math.min(weeks.length - 1, currentWeekIdx + 1)
    setCurrentWeekIdx(newIdx)
    setSelectedWeekIdx(newIdx)
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('fi-FI', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const currentWeek = weeks[currentWeekIdx]

  const isFirstWeek = currentWeekIdx === 0 || weeks.length === 0 || weeks[currentWeekIdx].idx === weeks[0].idx
  const isLastWeek =
    currentWeekIdx === weeks.length - 1 ||
    weeks.length === 0 ||
    weeks[currentWeekIdx].idx === weeks[weeks.length - 1].idx

  return (
    <div className='flex flex-col gap-6 md:gap-8 pb-20 md:pb-0 justify-start'>
      <WeekCard key={currentWeek.key} week={currentWeek} />
      <DateNavContainer>
        {/* Mobile Navigation */}
        <div className='flex md:hidden items-center justify-between w-full'>
          <Button onClick={handlePrevWeek} disabled={isFirstWeek} variant='secondary' size='lg'>
            <ArrowLeftIcon className='w-4 h-4' />
          </Button>
          <div className='flex items-center justify-center gap-2'>
            <div className='w-1 h-1 rounded-full bg-gray-300 opacity-60'></div>
            <div className='text-base font-semibold'>Viikko {currentWeek.weekNumber}</div>
            <div className='w-1 h-1 rounded-full bg-gray-300 opacity-60'></div>
          </div>
          <Button onClick={handleNextWeek} disabled={isLastWeek} variant='secondary' size='lg'>
            <ArrowRightIcon className='w-4 h-4' />
          </Button>
        </div>
        
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center justify-between w-full'>
          <Button onClick={handlePrevWeek} disabled={isFirstWeek} variant='secondary' size='lg'>
            <ArrowLeftIcon className='w-4 h-4' />
          </Button>
          <div className='text-center font-semibold'>
            <div className='text-base md:text-lg'>Viikko {currentWeek.weekNumber}</div>
            <div className='text-sm text-gray-500'>
              ({formatDate(currentWeek.start)} - {formatDate(currentWeek.end)})
            </div>
          </div>
          <Button onClick={handleNextWeek} disabled={isLastWeek} variant='secondary' size='lg'>
            <ArrowRightIcon className='w-4 h-4' />
          </Button>
        </div>
      </DateNavContainer>
    </div>
  )
}
