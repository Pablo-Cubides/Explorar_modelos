import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '../app/page'

describe('Playground interactions', () => {
  it('updates pattern description when sliders change', async () => {
    render(<Home />)
  // Open the Playground step (step 3) so the interactive panel is visible
  const step3 = screen.getByLabelText(/Ir al paso 3/i)
  step3.click()

  // Now the pattern description should render inside the playground
  const desc = await screen.findByText(/Interpretación del comportamiento/i)
  expect(desc).toBeTruthy()

    // move temperature slider to a low value (0.1) to push towards deterministic pattern
    const tempSlider = screen.getByLabelText(/Temperatura/i) as HTMLInputElement
    fireEvent.change(tempSlider, { target: { value: '0.1' } })

    // Move top-k to a low value
    const kSlider = screen.getByLabelText(/Top-k/i) as HTMLInputElement
    fireEvent.change(kSlider, { target: { value: '3' } })

    // Move top-p to a low value (0.15)
    const pSlider = screen.getByLabelText(/Top-p/i) as HTMLInputElement
    fireEvent.change(pSlider, { target: { value: '0.15' } })

    // Move repetition penalty to moderate
    const rSlider = screen.getByLabelText(/Penalización por repetición/i) as HTMLInputElement
    fireEvent.change(rSlider, { target: { value: '1.02' } })

  // Now the description text should update to one that matches a low-creativity pattern (A/B/J etc.)
  const strong = await screen.findByText(/Interpretación del comportamiento:/i)
  // The description span is the nextText node inside the same paragraph; get parent and find the span
  const parent = strong.closest('p')
  expect(parent).toBeTruthy()
  const span = parent?.querySelector('span')
  expect(span).toBeTruthy()
  const text = span?.textContent || ''
  expect(/Súper determinista|Conservador|Preciso/i.test(text)).toBe(true)
  })
})
