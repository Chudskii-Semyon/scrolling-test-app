import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import './app.global.css';
// import { loremIpsum } from 'lorem-ipsum';

let knex = require('knex')({
  client: 'sqlite3', connection: { filename: './tasks.sqlite' }
});

const tasks = [];

//
// for (let i = 0; i < 100; i++) {
//   const name = loremIpsum({ count: 5, units: 'words' });
//   // const randomDay = Math.random
//   knex('user').insert({ name });
// }
// function randomDate(start, end) {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
// }

// for (let i = 0; i < 400; i++) {
  // console.log(Math.random());
//
//   tasks.push({
//     title: loremIpsum({ count: 5, units: 'words' }),
//     created_at: randomDate(new Date(2000, 0, 1), new Date())
//   });
// }
//
// knex.schema.createTable('tasks', (table) => {
//   table.increments('id');
//   table.string('title');
//   table.timestamp('created_at');
// })
//   .then(() => {
//     console.log('Table created successfully');

    // knex.insert(tasks).into('tasks')
    //   .then(() => {
    //     console.log('Tasks created successfully');
    //
    //     knex('tasks').where({}).then(res => console.log('Tasks = ', res)).catch(err => console.log('Error = ', err));
    //   })
    //   .catch(err => console.log(err));
  // })
  // .catch(err => console.log('Error = ', err));

render(
  <AppContainer>
    <Root/>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
