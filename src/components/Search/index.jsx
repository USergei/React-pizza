import { useContext, useRef, useCallback, useState } from 'react'
import debounce from 'lodash.debounce'

import { SearchContext } from '../../App'
import styles from './Search.module.scss'
import search from '../../assets/img/search.svg'
import clear from '../../assets/img/clear-icon.svg'

const Search = () => {
  const [value, setValue] = useState('')
  const { setSearchValue } = useContext(SearchContext)
  const inputRef = useRef()

  const updateSearchValue = useCallback(
    debounce(str => {
      setSearchValue(str)
    }, 500),
    [],
  )

  const onInputChage = (event) => {
    setValue(event.target.value)
    updateSearchValue(event.target.value)
  }

  const onClickClear = () => {
    setSearchValue('')
    setValue('')
    inputRef.current.focus()
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
