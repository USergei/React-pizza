import React from 'react'
import { useRef, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import debounce from 'lodash.debounce'

import { setSearchValue } from '../../redux/slices/filterSlice'

import styles from './Search.module.scss'
import search from '../../assets/img/search.svg'
import clear from '../../assets/img/clear-icon.svg'

const Search: React.FC = () => {
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const updateSearchValue = useCallback(
    debounce((str: string) => {
      dispatch(setSearchValue(str))
    }, 500),
    [],
  )

  const onInputChage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    updateSearchValue(event.target.value)
  }

  const onClickClear = () => {
    setSearchValue('')
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div className={styles.root}>
      <img className={styles.icon} src={search} alt="search" />
      <input
        className={styles.input}
        ref={inputRef}
        value={value}
        onChange={onInputChage}
        placeholder="Поиск пиццы..."
      />
      {value && (
        <img
          className={styles.clearIcon}
          onClick={() => onClickClear()}
          src={clear}
          alt="clear icon"
        />
      )}
    </div>
  )
}

export default Search
