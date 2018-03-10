import React from 'react'
import { BrowserRouter as Router, Route, NavLink, Redirect } from 'react-router-dom'
import { ListGroup, ListGroupItem , Grid, Row, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'

const menuStyle = {
  backgroundColor: '#7FFFD4',
  padding : 15
}

const hStyle = {
  color: '#00BFFF'
}

const Menu = () => (
  <div style={menuStyle}>    
    <NavLink exact to="/" activeStyle={{
        fontWeight: 'bold',
        color: '#00008B'
      }}>
      anecdotes</NavLink>&nbsp;
      <NavLink exact to="/create" activeStyle={{
        fontWeight: 'bold',
        color: '#00008B'
      }}>create new</NavLink>&nbsp;
    <NavLink exact to="/about" activeStyle={{
        fontWeight: 'bold',
        color: '#00008B'
      }}>about</NavLink>&nbsp;
  </div>
)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2 style={hStyle} >Anecdotes</h2>
    <ListGroup>
      {anecdotes.map(anecdote => 
        <ListGroupItem key={anecdote.id} >
          <NavLink exact to={`/anecdotes/${anecdote.id}`} activeStyle={{
            fontWeight: 'bold',
            color: '#00008B'
          }}>{anecdote.content}</NavLink>
        </ListGroupItem>
      )}
    </ListGroup>  
  </div>
)

const Anecdote = ({anecdote}) => {
  return(
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <ListGroup>
      <ListGroupItem>has {anecdote.votes} votes</ListGroupItem>
      <ListGroupItem>for more info see {anecdote.info}</ListGroupItem>
      </ListGroup>
    </div>
  )
}

const About = () => (
  <Grid>
    <Row className="show-grid">
      <Col xs={12}>
        <h2 style={hStyle}> About anecdote app</h2>
        <p>According to Wikipedia:</p>
      </Col>
    </Row>
    <Row className="show-grid">
    <Col xs={12} md={8}>
    <em>An anecdote is a brief, revealing account of an individual person or an incident. 
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself, 
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative. 
      An anecdote is "a story with a point."</em>
      <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
    </Col>
    <Col xs={6} md={4}>
      <div><img src="../Linus.jpg" alt="Thorvaldsin kuva"/></div>
    </Col>
  </Row>
  </Grid>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/TKT21009/121540749'>Full Stack -sovelluskehitys</a>.

    See <a href='https://github.com/mluukkai/routed-anecdotes'>https://github.com/mluukkai/routed-anecdotes</a> for the source code. 
  </div>
)

class CreateNew extends React.Component {
  constructor() {
    super()
    this.state = {
      content: '',
      author: '',
      info: ''
    }
  }

  handleChange = (e) => {
    console.log(e.target.name, e.target.value)
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.addNew({
      content: this.state.content,
      author: this.state.author,
      info: this.state.info,
      votes: 0
    })
  }

  render() {
    return(
      <div>
        <h2 style={hStyle}>create a new anecdote</h2>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
          <ControlLabel>
            content
          </ControlLabel>
          <FormControl
            name='content' 
            value={this.state.content} 
            onChange={this.handleChange} 
          />
         
          <ControlLabel>
            author
          </ControlLabel>
          <FormControl 
            name='author' 
            value={this.state.author} 
            onChange={this.handleChange} 
          />
          
          <ControlLabel>
            url for more info
          </ControlLabel>
          <FormControl 
            name='info' 
            value={this.state.info} 
            onChange={this.handleChange} 
          />
          <Button bsStyle="success" type="submit">create</Button>
          </FormGroup>
        </form>
      </div>  
    )

  }
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: '1'
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: '2'
        }
      ],
      notification: '',
      redirectOption: false,
      notStyle: null
    } 
  }

  addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    this.setState({ anecdotes: this.state.anecdotes.concat(anecdote), 
      notification: `a new anecdote ${anecdote.content} created!`,
      redirectOption: true,
      notStyle: {
        border: "2px solid #66CDAA",
        borderRadius: 10,
        margin: 10,
        padding: 5
      }
    })
    setTimeout(() => {
      this.setState({notification: '',redirectOption: false, notStyle: null})
    }, 10000)
  }

  anecdoteById = (id) =>
    this.state.anecdotes.find(a => a.id === id)

  vote = (id) => {
    const anecdote = this.anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const anecdotes = this.state.anecdotes.map(a => a.id === id ? voted : a)

    this.setState({ anecdotes })
  }

  render() {
    return (
      <div className="container">
        <h1 style={hStyle}>Software anecdotes</h1>
        <Router>
          <div>
            <Menu />
            <div style={this.state.notStyle}>{this.state.notification}</div>
            <Route exact path="/" render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
            <Route exact path="/about" render={() => <About />} />      
            <Route exact path="/create" 
              render={() => this.state.redirectOption ? 
              <Redirect to="/" />: 
              <CreateNew addNew={this.addNew}/>
            } />
            <Route exact path="/anecdotes/:id" render={({match}) =>
              <Anecdote anecdote={this.anecdoteById(match.params.id)} />}
            />
          </div>
        </Router>
        <Footer />
      </div>
    )
  }
}

export default App;