import { useState } from 'react';
import Shell from './components/Shell';
import CitizenPortal from './components/CitizenPortal';
import OfficerCommandCenter from './components/OfficerCommandCenter';

export default function App() {
  const [portal, setPortal] = useState('citizen');

  return (
    <Shell portal={portal} setPortal={setPortal}>
      {portal === 'citizen' ? <CitizenPortal /> : <OfficerCommandCenter />}
    </Shell>
  );
}
