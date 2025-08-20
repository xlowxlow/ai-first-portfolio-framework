'use client'

import { useEffect, useState } from 'react'

interface TypeWriterProps {
  texts: string[]
  speed?: number
  deleteSpeed?: number
  delayBetweenTexts?: number
}

export function TypeWriter({
  texts,
  speed = 100,
  deleteSpeed = 50,
  delayBetweenTexts = 2000,
}: TypeWriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const text = texts[currentTextIndex]
    
    if (!isDeleting) {
      if (currentText !== text) {
        const timeout = setTimeout(() => {
          setCurrentText(text.slice(0, currentText.length + 1))
        }, speed)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true)
        }, delayBetweenTexts)
        return () => clearTimeout(timeout)
      }
    } else {
      if (currentText !== '') {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, deleteSpeed)
        return () => clearTimeout(timeout)
      } else {
        setIsDeleting(false)
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
      }
    }
  }, [currentText, currentTextIndex, isDeleting, texts, speed, deleteSpeed, delayBetweenTexts])

  return (
    <span>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}