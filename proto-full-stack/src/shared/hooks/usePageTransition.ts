'use client'

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

function scrollToProductList(listRef: RefObject<HTMLElement | null>) {
  window.requestAnimationFrame(() => {
    const list = listRef.current
    if (!list) return
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
    const top = list.getBoundingClientRect().top + window.scrollY - headerHeight - 12
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  })
}

export default function usePageTransition(setCurrentPage: (page: number) => void, listRef: RefObject<HTMLElement | null>) {
  const [isPageChanging, setIsPageChanging] = useState(false)
  const transitionTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current)
  }, [])

  const changePage = (page: number) => {
    setIsPageChanging(true)
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current)
    transitionTimer.current = window.setTimeout(() => {
      setCurrentPage(page)
      scrollToProductList(listRef)
      transitionTimer.current = window.setTimeout(() => setIsPageChanging(false), 160)
    }, 160)
  }

  return { changePage, isPageChanging }
}
