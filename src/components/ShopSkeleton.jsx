import React from 'react';

const ShopSkeleton = () => (
  <div>
    <div className="shop-info">
      <div className="shop-name skeleton"></div>
      <div className='shop-location'>
        <div className='location skeleton'><i className="fas fa-map-marker-alt"></i></div>
        <div className='phone skeleton'><i className="fas fa-phone"></i></div>
      </div>
    </div>

    <div className="card-container">
      {[...Array(6)].map((_, index) => (
        <div className="mini-card skeleton" key={index}>
          <div className="img-container skeleton"></div>
          <div className="item-container skeleton">
            <h2 className="item-name skeleton"></h2>
            <div className="price-container skeleton"></div>
            <div className="button-container skeleton"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ShopSkeleton;
