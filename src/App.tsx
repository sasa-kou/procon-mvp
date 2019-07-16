import * as React from 'react'
import SearchBar from './components/searchBar'
import Tags from './containers/tagsContainer'
import CategoryButton from './components/categoryButton'

class App extends React.Component {
  render() {
    return (
      <div>
        <SearchBar />
        <Tags />
        <CategoryButton />
      </div>
    )
  }
}

export default App