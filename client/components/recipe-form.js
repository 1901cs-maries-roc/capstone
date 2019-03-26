import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {addRecipeThunk, addRecipeFromUrl} from '../store/recipe'
import {connect} from 'react-redux'
import AddUrl from './recipe-form-addUrl'
import SubmittedModal from './recipe-form-submitted'
import Collapse from 'react-bootstrap/Collapse'
import RecipeFormManual from './recipe-form-manual'

class RecipeForm extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      imgUrl: '/recipe-default.jpg',
      prepTime: 0,
      cookTime: 0,
      totalTime: 0,
      serving: 0,
      steps: [],
      ingredients: [],
      validated: false,
      scrapeUrl: '',
      newRecipeId: 0,
      isSaving: false,
      open: false
    }
    this.baseState = this.state
  }

  resetForm = () => {
    this.setState(this.baseState)
  }

  scrape = async () => {
    this.setState({isSaving: true})
    await this.props.addRecipeFromUrl(this.state.scrapeUrl)
    const newRecipeId = this.props.newRecipe.id
    this.setState({newRecipeId, isSaving: false})
  }

  handleSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      const recipe = {
        imgUrl: this.state.imgUrl,
        name: this.state.name,
        prepTime: this.state.prepTime,
        cookTime: this.state.cookTime,
        totalTime: this.state.totalTime,
        serving: this.state.serving,
        steps: this.state.steps,
        ingredients: this.state.ingredients
      }
      await this.props.addRecipeThunkDispatch(recipe)
      const newRecipeId = this.props.newRecipe.id
      this.setState({newRecipeId, isSaving: false})
    }
    this.setState({validated: true})
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
    console.log('after handlechange in form', this.state)
  }

  render() {
    const {
      validated,
      newRecipeId,
      isSaving,
      scrapeUrl,
      imgUrl,
      open,
      name,
      steps,
      ingredients
    } = this.state
    // imgUrl = imgUrl.length ? imgUrl : '/recipe-default.jpg'

    return (
      <Container className="container">
        <SubmittedModal newRecipeId={newRecipeId} resetForm={this.resetForm} />
        <Row>
          <h1>Add a recipe</h1>
        </Row>
        <AddUrl
          handleChange={this.handleChange}
          scrape={this.scrape}
          newRecipeId={newRecipeId}
          isSaving={isSaving}
          scrapeUrl={scrapeUrl}
        />
        <Row className="row-grid">
          <h4>Manually Enter a Recipe</h4>
        </Row>
        <Button
          onClick={() => this.setState({open: !open})}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          Add
        </Button>
        <Collapse in={this.state.open}>
          <RecipeFormManual />
        </Collapse>
      </Container>
    )
  }
}

const mapState = state => ({
  newRecipe: state.recipe.recipe
})

const mapDispatch = dispatch => {
  return {
    addRecipeThunkDispatch: recipe => dispatch(addRecipeThunk(recipe)),
    addRecipeFromUrl: url => dispatch(addRecipeFromUrl(url))
  }
}

export default connect(mapState, mapDispatch)(RecipeForm)
