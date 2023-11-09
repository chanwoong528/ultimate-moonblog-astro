//@ts-nocheck

import React, { useState } from 'react'
import { getPost } from '../../../http/posts/ApiPost';

const NavPost = ({ navData }) => {
  const [curTabId, setCurTabId] = useState();
  const [postList, setPostList] = useState([]);

  const onClickNav = (categoryId) => {
    setCurTabId(categoryId)
    fetchPostByCateId(categoryId);
  }
  const fetchPostByCateId = async (categoryId) => {
    const postRes = await getPost(categoryId)
    console.log(postRes)
  }


  return (
    <nav>
      {curTabId}
      <ul>
        {navData.map((nav) => {
          return <li>
            <button onClick={() => onClickNav(nav.id)}>
              {nav.label}
            </button>
          </li>
        })}
      </ul>
    </nav>
  )
}

export default NavPost