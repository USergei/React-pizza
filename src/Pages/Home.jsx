import { useEffect, useContext, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import qs from 'qs'

import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice'
import { fetchPizzas } from '../redux/slices/pizzaSlice'

import { SearchContext } from '../App'
import Categories from '../components/Categories'
import Sort from '../components/Sort'
import { sortList } from '../components/Sort'
import PizzaBlock from '../components/PizzaBlock'
import { Skeleton } from '../components/PizzaBlock/Skeleton'
import Pagination from '../components/Pagination'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isSearch = useRef(false)
  const isMounted = useRef(false)
  const { categoryId, sort, currentPage } = useSelector(state => state.filterSlice)
  const { items, status } = useSelector(state => state.pizzaSlice)

  const { searchValue } = useContext(SearchContext)

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id))
  }

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number))
  }

  const getPizzas = async () => {
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
    const sortBy = sort.sortProperty.replace('-', '')
    const category = categoryId > 0 ? `category=${categoryId}` : ''
    const search = searchValue ? `&search=${searchValue}` : ''

    dispatch(fetchPizzas({ order, sortBy, category, search, currentPage }))
  }

  // Если изменили параметры и был первый рендер
  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      })

      navigate(`?${queryString}`)
    }
    isMounted.current = true
  }, [categoryId, sort.sortProperty, currentPage])

  // Если был первый рендер, то проверяем URL-параметры и сохраняем в редаксе
  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1))

      const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty)

      dispatch(
        setFilters({
          ...params,
          sort,
        }),
      )
      isSearch.current = true
    }
  }, [])

  // Если был первый рендер, то запрашиваем пиццы
  useEffect(() => {
    window.scrollTo(0, 0)

    if (!isSearch.current) {
      getPizzas()
    }
    isSearch.current = false
  }, [categoryId, sort.sortProperty, searchValue, currentPage])

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={(i) => onChangeCategory(i)} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка</h2>
          <p>Не удалось получить пиццы. Попробуйте повторить попытку позже или изменить запрос</p>
        </div>
      ) : (
        <div className="content__items">
          {status === 'loading'
            ? [...new Array(4)].map((_, index) => <Skeleton key={index} />)
            : items.map((obj) => <PizzaBlock key={obj.id} {...obj} />)}
        </div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  )
}

export default Home
