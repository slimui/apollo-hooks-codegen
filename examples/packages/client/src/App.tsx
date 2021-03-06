import React, { useRef, useState } from 'react'
import {
  ApolloHooksProvider,
  useQuery,
  getAllTodos,
  useMutation,
  createTodo,
  useSubscription,
  subscribeTodos,
  useQueryWithSubscription,
} from './queries'
import { apolloClient } from './apollo-client'
import { TodoList } from './components/TodoList'

export default function App() {
  return (
    <ApolloHooksProvider apolloClient={apolloClient}>
      <MyComponent />
    </ApolloHooksProvider>
  )
}

function MyComponent() {
  const mutate = useMutation(createTodo())

  const queryResult = useQueryWithSubscription(
    getAllTodos(),
    subscribeTodos(),
    (queryData, subData) => {
      return {
        todoItems: [...queryData.todoItems, subData.newTodoItem],
      }
    }
  )
  if (queryResult.loading) return <div>Loading</div>
  if (queryResult.error) return <div>Error</div>
  const todoItems = queryResult.data!.todoItems

  function onSubmit(text: string) {
    mutate({
      variables: {
        todoItem: { title: text },
      },
    })
  }

  return <TodoList items={todoItems} onSubmit={onSubmit} />
}
