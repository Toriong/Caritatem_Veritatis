import React from 'react'
import { useLayoutEffect } from 'react';
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { UserLocationContext } from '../../provider/UserLocationProvider';

const PageUnderConstruction = () => {
  const { _isUserOnHomePage } = useContext(UserLocationContext);
  const [isUserOnHomePage, setIsUserOnHomePage] = _isUserOnHomePage;


  useLayoutEffect(() => {
    setIsUserOnHomePage(true);
  }, []);

  return (
    <div className='clientSideNotifyPage'>
      <section>
        <p>This page is currently under construction. Come back later.</p>
      </section>
    </div>
  )
}

export default PageUnderConstruction;