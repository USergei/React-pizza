import { useContext } from 'react'

import { SearchContext } from '../../App'
import styles from './Search.module.scss'
import search from '../../assets/img/search.svg'
import clear from '../../assets/img/clear-icon.svg'

const Search = () => {
  const { searchValue, setSearchValue } = useContext(SearchContext)

  return (
    <div className={styles.root}>
      <img className={styles.icon} src={search} alt="search" />
      <input
        className={styles.input}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Поиск пиццы..."
      />
      {searchValue && (
        <img
          className={styles.clearIcon}
          onClick={() => setSearchValue('')}
          src={clear}
          alt="clear icon"
        />
      )}
    </div>
  )
}

export default Search
