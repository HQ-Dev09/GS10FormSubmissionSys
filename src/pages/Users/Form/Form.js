import React from 'react'
import UserNavigation from '../../../components/UserNavigation/UserNavigation';
import UserHeader from '../../../components/UserHeaderSetup/UserHeader';
import UserUGCards from '../../../components/UserUGCards/UserUGCards';




const Form = () => {




  return (
    <div >
      {/* navigation */}
      <UserNavigation />
      <UserHeader page="FormPage"/>
      <UserUGCards/>

    </div>
  )
}

export default Form