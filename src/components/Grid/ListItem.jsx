import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

/*
<div className="flex-item item-type width70">
    <div className="spacing">
        <span className="blue-border hide"></span>
        <span className="blue-block">Dn</span>
    </div>
</div>
<div className="flex-item item-projects width38">
    <div className="spacing">
        <Link to="" className="link-title">isongU</Link>
        <span className="txt-time">04 Apr 2016</span>
    </div>
</div>
<div className="flex-item item-status width9">
    <div className="spacing">
        <span className="txt-status status-active">Working</span>
    </div>
</div>
<div className="flex-item item-status item-status-date width9">
    <div className="spacing">
        <span className="txt-italic txt-normal">Jul 5</span>
    </div>
</div>
<div className="flex-item item-customer width12">
    <div className="spacing">
        <div className="user-block">
            <a href="javascript:;" className="photo">
                img src="images/portrait2-60x60.jpg" alt="photo">
            </a>
            <span className="txt-box">
                <a href="javascript:;" className="link-black">Samuel Adams</a>
                <span className="txt-gray">sam_adams</span>
            </span>
        </div>
    </div>
</div>
<div className="flex-item item-copilot width11">
    <div className="spacing">
        <div className="user-block">
            <div className="item-mask-layer"></div>
            <a href="javascript:;" className="photo">
                <img src="images/portrait1-40x40.jpg" alt="photo">
            </a>
            <span className="txt-box">
                <a href="javascript:;" className="link-black">mahestro</a>
                <span className="txt-gray">invited</span>
            </span>
        </div>
    </div>
</div>
<div className="flex-item item-price width7">
    <div className="spacing">
        <span className="txt-price yellow-light">$ 15,000</span>
        <span className="txt-gray-sm">Quoted</span>
    </div>
</div>
<div className="flex-item item-ref-code width8">
    <div className="spacing">
        <span className="txt-gray-md">ABC123</span>
        <div className="function-part">
            <a href="javascript:;" className="btn-dots-vertical"></a>
            <div className="tip-part hide">
                <a href="javascript:;" className="btn-x-mark"></a>
                <ul>
                    <li><a href="javascript:;" className="btn-flag"><span className="txt">Status</span></a></li>
                    <li><a href="javascript:;" className="btn-pencil"><span className="txt">Edit</span></a></li>
                    <li><a href="javascript:;" className="btn-trash-can"><span className="txt">Delete</span></a></li>
                </ul>
            </div>
        </div>
    </div>
</div>

 */

const ListItem = ({ item, columns }) => {

  const renderColumn = (col, index) => {
    const divClasses = `flex-item-title ${col.classes}`
    return (
      <div className={divClasses} key={index}>
          <div className="spacing">
              {col.renderText(item)}
          </div>
      </div>
    )
  }
  return (
    <div className="row">
      <div className="flex-row">
          <div className="mask-layer hide"></div>
          {columns.map(renderColumn)}
      </div>
    </div>
  )
}

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ListItem
