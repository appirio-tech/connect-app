import React, { PropTypes } from 'react'
import classNames from 'classnames'
/**
 *
 <div className="flex-item-title item-type width70">
   <div className="spacing">Type</div>
 </div>
 <div className="flex-item-title item-projects width38">
   <div className="spacing">
     <span className="txt txt-black">Projects</span>
     <div className="drop-down">
       <a href="javascript:;" className="txt-link">Latest first</a>
       <div className="down-layer hide">
         <ul>
           <li><a href="javascript:;">Latest first</a></li>
           <li><a href="javascript:;">Oldest first</a></li>
           <li><a href="javascript:;">Name A-Z</a></li>
           <li className="active"><a href="javascript:;">Name Z-A</a></li>
         </ul>
       </div>
       {/* down-layer *}
     </div>
     {/* drop-down *}
   </div>
 </div>
 <div className="flex-item-title item-status width9">
   <div className="spacing"><a href="javascript:;" className="sort-txt">Status</a></div>
 </div>
 <div className="flex-item-title item-status-date width9">
   <div className="spacing"><a href="javascript:;" className="sort-txt">Status Date</a></div>
 </div>
 <div className="flex-item-title item-customer width12">
   <div className="spacing">
     <a href="javascript:;" className="sort-txt icon-up">Customer</a></div>
 </div>
 <div className="flex-item-title item-copilot width11">
   <div className="spacing"><a href="javascript:;" className="sort-txt">Copilot</a></div>
 </div>
 <div className="flex-item-title item-price width7">
   <div className="spacing"><a href="javascript:;" className="sort-txt icon-down">Price</a></div>
 </div>
 <div className="flex-item-title item-ref-code width8">
   <div className="spacing"><a href="javascript:;" className="sort-txt">Ref code</a></div>
 </div>
</div>
</div>
 */

const ListHeader = ({ headers, sortHandler, currentSortFields }) => {

  const renderColumn = (col, index) => {
    const divClasses = `flex-item-title ${col.classes}`
    // TODO handle sorting
    const sortClasses = 'sort-txt'
    return (
      <div className={divClasses} key={index}>
        <div className="spacing">
          <a onClick={sortHandler.bind(col.id)} className={sortClasses}>
            {col.headerLabel}
          </a>
        </div>
      </div>
    )
  }
  return (
    <div className="row">
      <div className="flex-row row-th">
        <div className="mask-layer hide"></div>
        { headers.map(renderColumn)}
      </div>
    </div>
  )
}

ListHeader.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortHandler: PropTypes.func,
  currentSortFields: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ListHeader
