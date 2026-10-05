import { useState, useRef, useEffect, useId, useCallback, type KeyboardEvent } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  required?: boolean
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  label,
  required = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [searchQuery, setSearchQuery] = useState('')

  const selectRef = useRef<HTMLDivElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonId = useId()
  const listboxId = useId()
  const errorId = useId()
  const searchId = useId()

  const selectedOption = options.find(opt => opt.value === value)

  const filteredOptions = searchQuery
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  const closeDropdown = useCallback(() => {
    setIsClosing(true)
    const el = dropdownRef.current
    if (el) {
      const onEnd = () => {
        el.removeEventListener('animationend', onEnd)
        setIsOpen(false)
        setIsClosing(false)
        setHighlightedIndex(-1)
        setSearchQuery('')
      }
      el.addEventListener('animationend', onEnd)
    } else {
      setIsOpen(false)
      setIsClosing(false)
      setHighlightedIndex(-1)
      setSearchQuery('')
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: Event) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeDropdown])

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const highlightedElement = listboxRef.current.children[highlightedIndex + 1] as HTMLElement
      highlightedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [isOpen, highlightedIndex])

  useEffect(() => {
    if (isOpen && !isClosing && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, isClosing])

  const handleToggle = () => {
    if (disabled) return
    if (isOpen) {
      closeDropdown()
    } else {
      setIsOpen(true)
      if (value) {
        const index = filteredOptions.findIndex(opt => opt.value === value)
        setHighlightedIndex(index)
      }
    }
  }

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return
    onChange?.(option.value)
    closeDropdown()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          if (value) {
            const index = filteredOptions.findIndex(opt => opt.value === value)
            setHighlightedIndex(index)
          }
        } else if (highlightedIndex >= 0) {
          const option = filteredOptions[highlightedIndex]
          handleSelect(option)
        }
        break

      case 'Escape':
        e.preventDefault()
        closeDropdown()
        break

      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setHighlightedIndex(value ? filteredOptions.findIndex(opt => opt.value === value) : 0)
        } else {
          const nextIndex = highlightedIndex < filteredOptions.length - 1 ? highlightedIndex + 1 : 0
          const nextAvailable = filteredOptions.findIndex((opt, idx) => idx >= nextIndex && !opt.disabled)
          setHighlightedIndex(nextAvailable >= 0 ? nextAvailable : 0)
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setHighlightedIndex(value ? filteredOptions.findIndex(opt => opt.value === value) : filteredOptions.length - 1)
        } else {
          const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : filteredOptions.length - 1
          for (let i = prevIndex; i >= 0; i--) {
            if (!filteredOptions[i].disabled) {
              setHighlightedIndex(i)
              break
            }
          }
        }
        break

      case 'Home':
        e.preventDefault()
        if (isOpen) {
          const firstEnabled = filteredOptions.findIndex(opt => !opt.disabled)
          setHighlightedIndex(firstEnabled >= 0 ? firstEnabled : 0)
        }
        break

      case 'End':
        e.preventDefault()
        if (isOpen) {
          for (let i = filteredOptions.length - 1; i >= 0; i--) {
            if (!filteredOptions[i].disabled) {
              setHighlightedIndex(i)
              break
            }
          }
        }
        break
    }
  }

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End':
        e.preventDefault()
        handleKeyDown(e as unknown as KeyboardEvent<HTMLDivElement>)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          const option = filteredOptions[highlightedIndex]
          handleSelect(option)
        }
        break
      case 'Escape':
        e.preventDefault()
        closeDropdown()
        break
    }
  }

  const showDropdown = isOpen || isClosing

  return (
    <div className="w-full relative">
      {label && (
        <label htmlFor={buttonId} className="block text-sm font-medium text-support-100 mb-1.5">
          {label}
          {required && <span className="text-primary-500 ml-0.5" aria-label="required">*</span>}
        </label>
      )}

      <div
        ref={selectRef}
        className={`relative w-full ${showDropdown ? 'z-[101]' : 'z-[1]'}`}
      >
        <div
          id={buttonId}
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={isOpen && !isClosing}
          aria-haspopup="listbox"
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          tabIndex={disabled ? -1 : 0}
          className={`
            w-full flex items-center justify-between gap-3 px-4 py-2.5
            bg-transparent border rounded-md
            text-[15px] text-support-100
            cursor-pointer select-none outline-none
            transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${error
              ? 'border-danger-500'
              : 'border-[#e2e2e220]'
            }
            ${isOpen && !isClosing
              ? error
                ? 'border-danger-500 shadow-[0_0_0_3px_rgba(227,53,63,0.15)]'
                : 'border-primary-500 shadow-[0_0_0_2px_rgba(71,152,209,0.2)]'
              : ''
            }
            ${disabled
              ? 'opacity-50 cursor-not-allowed bg-[#e2e2e206]'
              : 'hover:border-[#e2e2e240] hover:bg-[#e2e2e206] focus-visible:border-primary-500 focus-visible:shadow-[0_0_0_2px_rgba(71,152,209,0.2)]'
            }
          `}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
        >
          <span className={`flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-150 ${!selectedOption ? 'text-support-400 opacity-70' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`flex-shrink-0 text-support-300 transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen && !isClosing ? 'rotate-180' : ''}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className={`absolute top-[calc(100%+4px)] left-0 right-0 z-[100] bg-dark-900 border border-[#e2e2e220] rounded-md shadow-[0_2px_6px_0_rgba(0,0,0,0.15),0_8px_24px_0_rgba(0,0,0,0.3)] overflow-hidden origin-top select-dropdown-${isClosing ? 'exit' : 'enter'}`}
            style={{
              animation: isClosing
                ? 'selectExit 120ms cubic-bezier(0.3, 0, 0.8, 0.15) forwards'
                : 'selectEnter 200ms cubic-bezier(0.05, 0.7, 0.1, 1) forwards',
            }}
          >
            <div className="relative flex items-center px-2 pt-2 pb-1 border-b border-[#e2e2e220] bg-dark-900">
              <svg
                className="absolute left-4 text-support-300 opacity-50 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={searchInputRef}
                id={searchId}
                type="text"
                className="flex-1 py-2 pl-9 pr-8 bg-[#e2e2e206] border border-[#e2e2e220] rounded text-sm text-support-100 outline-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-support-400 placeholder:opacity-60 focus:border-primary-500 focus:bg-transparent"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setHighlightedIndex(0)
                }}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search options"
                aria-controls={listboxId}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-4 p-1 bg-transparent border-none rounded text-support-300 opacity-50 cursor-pointer flex items-center justify-center transition-all duration-150 hover:opacity-100 hover:bg-[#e2e2e220] animate-[clearBtnIn_100ms_ease-out]"
                  onClick={() => {
                    setSearchQuery('')
                    setHighlightedIndex(value ? filteredOptions.findIndex(opt => opt.value === value) : -1)
                    searchInputRef.current?.focus()
                  }}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M3 3L11 11M11 3L3 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={buttonId}
              className="max-h-60 overflow-y-auto list-none m-0 p-1"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled}
                    className={`
                      flex items-center justify-between gap-2 px-3 py-2.5 rounded-sm
                      text-[15px] text-support-100 cursor-pointer select-none
                      transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]
                      ${option.value === value ? 'text-primary-400 font-medium' : ''}
                      ${index === highlightedIndex && !option.disabled ? 'bg-[#e2e2e220]' : ''}
                      ${option.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#e2e2e220]'}
                    `}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => !option.disabled && setHighlightedIndex(index)}
                  >
                    {option.label}
                    {option.value === value && (
                      <svg
                        className="flex-shrink-0 text-primary-400"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 8L6.5 11.5L13 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </li>
                ))
              ) : (
                <li className="py-5 px-3 text-center text-sm text-support-400 opacity-70 cursor-default select-none" role="option" aria-disabled="true">
                  No results found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <div id={errorId} className="block mt-1.5 text-[13px] text-danger-400 leading-[1.4]" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
