import React, {Component} from 'react'
import OneRecipeCard from './all-recipes-card'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getAllRecipesThunk} from '../store'
import CardGroup from 'react-bootstrap/CardGroup'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Jumbotron from 'react-bootstrap/Jumbotron'

let juliaQuotes = [
  'People who love to eat are always the best people! --Julia Child',
  "It's so beautifully arranged on the plate — you know someone's fingers have been all over it. --Julia Child",
  'A party without cake is just a meeting. --Julia Child',
  "If you're afraid of butter, use cream --Julia Child",
  'Always start out with a larger pot than what you think you need --Julia Child'
]

const getRandomNum = max => {
  return Math.floor(Math.random() * Math.floor(max))
}

const getRandomQuote = () => {
  const max = juliaQuotes.length
  const randomNum = getRandomNum(max)
  return juliaQuotes.filter((quote, i) => quote[i] === quote[randomNum])
}

export class AllRecipes extends Component {
  componentDidMount() {
    this.props.getAllRecipesThunkDispatch()
  }

  render() {
    const allRecipes = this.props.allRecipes || []
    const recipe = allRecipes.length ? (
      allRecipes.map(r => {
        return (
          <Col key={r.id} xs="12" sm="6" md="4" lg="3">
            <Link to={`/recipes/${r.id}`}>
              {' '}
              <OneRecipeCard recipe={r} />
            </Link>
          </Col>
        )
      })
    ) : (
      <div>Empty</div>
    )

    return (
      <div>
        <Jumbotron className="jumbotron">
          <img className="headerIcon" src="/juliaicon_white.png" />
          <h2 className="headerText">{getRandomQuote()}</h2>
          {/* <p>
              <Button variant="primary">Learn more</Button>
            </p> */}
        </Jumbotron>
        <div className="home-page">
          {allRecipes.length ? (
            <CardGroup>{recipe}</CardGroup>
          ) : (
            <div className="loading">
              <img src="https://cdn.dribbble.com/users/82578/screenshots/2338455/loadinganimation.gif" />
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    allRecipes: state.recipe.recipes
  }
}

const mapDispatch = dispatch => {
  return {
    getAllRecipesThunkDispatch: () => dispatch(getAllRecipesThunk())
  }
}

export default connect(mapState, mapDispatch)(AllRecipes)
