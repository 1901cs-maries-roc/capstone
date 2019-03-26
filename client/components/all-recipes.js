import React, {Component} from 'react'
import OneRecipeCard from './all-recipes-card'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getAllRecipesThunk} from '../store'
import CardGroup from 'react-bootstrap/CardGroup'
import Container from 'react-bootstrap/Container'
import CardDeck from 'react-bootstrap/CardDeck'
import Col from 'react-bootstrap/Col'

export class AllRecipes extends Component {
  componentDidMount() {
    this.props.getAllRecipesThunkDispatch()
  }

  render() {
    const allRecipes = this.props.allRecipes || []
    const recipe = allRecipes.length ? (
      allRecipes.map(r => {
        return (
          <Col key={r.id} md={{span: 3}}>
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
      <Container className="container">
        <h1>All Recipes</h1>
        <CardDeck>{recipe.length ? recipe : <div>loading</div>}</CardDeck>
      </Container>
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
