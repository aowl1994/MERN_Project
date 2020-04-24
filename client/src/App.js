import React, { Component } from 'react';
import gql from "graphql-tag";
import compose from "lodash.flowright";
import {graphql} from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from "@material-ui/icons/Close"

import Form from './Form'

const TodosQuery = 
gql`
query{
  todos {
    id
    text
    complete
  }
}`;

const UpadteMutation = gql`
 mutation($id: ID!, $complete: Boolean!){
   updateTodo(id:$id, complete: $complete)
 }
`;

const RemoveMutation = gql`
mutation($id: ID!){
  remeveTodo(id:$id)
}`;

const CreateTodoMutation = gql`
 mutation($text: String!){
   createTodo(text: $text) {
     id
     text
     complete
   }
 }
`;

class App extends Component{

  updateTodo = async todo =>{
    // update todo
    await this.props.updateTodo({
      variable: {
        id: todo.id,
        complete : !todo.complete
      },
      update: store  => {
        const data = store.readQuery({query: TodosQuery});
        data.tools = data.todos.map(
          x=>
            x.id === todo.id 
              ? {
                ...todo,
                complete: !todo.complete
              }
              : x
        );
        store.writeQuery({query: TodosQuery, data});
      }
    });
  };

  removeTodo = async todo => {
    // remove todo
    await this.props.removeTodo({
      variable: {
        id: todo.id
      },
      update: store  => {
        const data = store.readQuery({query: TodosQuery});
        data.todos = data.todos.fiter(x => x.id !== todo.id)
        store.writeQuery({query: TodosQuery, data});
      }
    });
  };

  createTodo =  async text =>{
    // create the todo list
    await this.props.createTodo({
      variable: {
        text,
      },
      update: (store, {date: {createTodo}})  => {
        const data = store.readQuery({query: TodosQuery});
        data.todos.unshift(createTodo);
        store.writeQuery({query: TodosQuery, data});
      }
    });
  }

  render() {
    const {data:{loading, todos}} = this.props;
    if (loading){
      return null;
    }
    return (
    <div style={{display :'flex'}}>
      <div style = {{margin:'auto',width:400}}>
        <Paper elevation={1}>
          <Form submit={this.createTodo} />
          <List>
            {todos.map(todo =>(
          <ListItem key={todo.id}
          role={undefined} 
          dense 
          button 
          onClick={()=>this.updateTodo(todo)}
          >
            <Checkbox
                checked={todo.complete}
                tabIndex={-1}
                disableRipple
            />
            
            <ListItemText primary={todo.text} />
            <ListItemSecondaryAction>
              <IconButton onClick = {()=>this.removeTodo(todo)}>
                <CloseIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
            ))}
    </List>
        </Paper>
      </div>
    </div>
    );
   }
}


export default compose(
  graphql(CreateTodoMutation, {name:"createTodo"}),
  graphql(RemoveMutation,{name: 'removeTodo'}),
  graphql(UpadteMutation, {name: "updateTodo"}),
  graphql(TodosQuery))
  (App)
  ;
