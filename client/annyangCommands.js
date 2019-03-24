import annyang from 'annyang'

export const stop = () => {
  responsiveVoice.cancel()
}

export const speak = words => {
  // console.log('in speak', words)
  responsiveVoice.speak(words)
}

export const repeatStep = () => {
  // console.log('inside repeatStep')
  speak(document.getElementById('step-instructions').innerText)
}

export const listIngredients = () => {
  speak(document.getElementById('ingredients').innerText)
}

export const goBack = () => {
  if (document.getElementById('back').disabled) {
    speak('You are on the first step of the recipe')
  } else {
    speak('Previous step')
    document.getElementById('back').click()
  }
}

export const goToNext = () => {
  if (document.getElementById('next').disabled) {
    return speak("You've reached the end of the recipe")
  }
  document.getElementById('next').click()
  speak(document.getElementById('step-instructions').innerText)
}

export const backToRecipeOverview = () => {
  speak('Julia is now off')
  annyang.abort()
  document.getElementById('recipeOverview').click()
}

export const start = () => {
  console.log('in start')
  annyang.resume()
  speak(document.getElementById('step-instructions').innerText)
  document.getElementById('start').click()
}

export const startCooking = () => {
  console.log('in start cooking')
  speak('To begin cooking, press start, then say Hey Julia, instructions')
}

export const nullCommand = () => {
  speak('How can I help you?')
}

export const help = () => {
  speak(
    'You can ask me any of the following: Repeat, Ingredients, Back, Next, or Pause.'
  )
}
