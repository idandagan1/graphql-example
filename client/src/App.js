import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import './App.css';


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  header: {
    backgroundColor: '#222',
    height: '150px',
    padding: '20px',
    color: 'white',
    fontSize: '31px',
    fontFamily: 'fantasy',
  },
  input: {
    display: 'none',
  },
  box: {
    margin: '20px',
  },
  root: {
    width: '500px',
    height: '500px',
    border: '1px black solid',
    padding: '30px',
    margin: '20px',
    borderRadius: '3px',
  },
  result: {
    height: '100%',
  }
});


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: -1,
      data: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.findUserById = this.findUserById.bind(this);
    this.findNestedFriends = this.findNestedFriends.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  findNestedFriends(e) {
    const { userId } = this.state;
    client.query({
      query: gql`
      {
        user(id:${userId}){
          firstName,
          friends {
            firstName,
            friends {
              firstName,
              friends {
                firstName
              }
            }
          }
        }
      }`
    })
    .then(data => this.setState({ data }))
    .catch(error => console.error(error));
  }

  findUserById(userId) {
    client.query({
        query: gql`
          {
            user (id: ${userId}) {
              firstName
            }
          }`,
      })
      .then(data => this.setState({ data }))
      .catch(error => console.error(error));
  }

  onClick(e) {
    const { userId } = this.state;
    this.findUserById(userId);
  }
  render() {
    const { classes, loading } = this.props;
    const { data } = this.state;
    return (
      <Paper className="App">
          <Typography 
            className={classes.header}
            variant="subheading"
          >GraphQL Tutorial
          </Typography>
        <div className={classes.box}>
          <Input
            name="userId"
            autoComplete="false"
            placeholder="find users by id"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <Button 
            variant="outlined" 
            className={classes.button}
            onClick={this.onClick}
            >Find
          </Button>
          <Button 
            variant="outlined" 
            className={classes.button}
            onClick={this.findNestedFriends}
            >Find Nested Friends
          </Button>
        </div>
        {
          loading ?
            <CircularProgress className={classes.progress} size={50} />
            :
            <TextField
              value={JSON.stringify(data, null, 2)}
              rows={5}
              multiline
              className={classes.root}
              id="bootstrap-input"
              InputProps={{
                disableUnderline: true,
                classes: {
                  root: classes.result,
                  input: classes.bootstrapInput,
                },
              }}
            />
        }
        
      </Paper>
    );
  }
}

export default withStyles(styles)(App);
