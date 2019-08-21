import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { HashRouter as Router, Route } from 'react-router-dom';
import { useIdentities } from 'clubhouse-hooks';
import { layouts } from 'clubhouse-ui';
import ChannelList from './ChannelList';
import MessageList from './MessageList';
import CreateIdentity from './CreateIdentity';
import CreateChannel from './CreateChannel';
import Invite from './Invite';

const {
  Header,
} = layouts;

const Wrapper = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 250px auto;
  grid-template-rows: 50px auto;
`;

const Top = styled.div`
  grid-column-start: 1;
  grid-column-end: span 2;
  grid-row-start: 1;
  grid-row-end: span 1;
  border-bottom: solid 1px #ccc;
`;

const Sidebar = styled.div`
  grid-column-start: 1;
  grid-column-end: span 1;
  grid-row-start: 2;
  grid-row-end: span 1;
  overflow-y: auto;
  border-right: solid 1px #ccc;
`;

const Main = styled.div`
  grid-column-start: 2;
  grid-column-end: span 1;
  grid-row-start: 2;
  grid-row-end: span 1;
  overflow-y: auto;
`;

const App: FunctionComponent = () => {
  const { identities } = useIdentities();
  if (identities.length === 0) {
    return (
      <CreateIdentity />
    );
  }
  return (
    <Router>
      <Wrapper>
        <Top>
          <Header />
        </Top>
        <Sidebar>
          <ChannelList />
        </Sidebar>
        <Main>
          <>
            <Route exact path="/channel/:channel" component={MessageList} />
            <Route exact path="/channel/:channel/invite" component={Invite} />
            <Route exact path="/channel-create" component={CreateChannel} />
          </>
        </Main>
      </Wrapper>
    </Router>
  );
};

export default App;
