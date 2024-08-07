import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Pannellum } from 'pannellum-react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBu4EgPTNk8ZW3VwJ3p7_J42O0coyrRIyM",
  authDomain: "askundb.firebaseapp.com",
  projectId: "askundb",
  storageBucket: "askundb.appspot.com",
  messagingSenderId: "873898080051",
  appId: "1:873898080051:web:0c24b0114fcd9f4d1c3046"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function ShopDetails() {
  const location = useLocation();
  const { propertyData, documentId } = location.state;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  const addToCart = async (property) => {
    if (!currentUser) {
      console.warn('User is not signed in. Please sign in to add property to cart.');
      return;
    }

    const uid = currentUser.uid;

    try {
      const userRef = doc(db, 'Users', uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {});
      }

      const cartRef = collection(userRef, 'Cart');
      const propertyWithTimestamp = {
        ...property,
        addedAt: serverTimestamp()
      };

      // Add the selected property to the cart
      await addDoc(cartRef, propertyWithTimestamp);

      alert('Property added to cart successfully!');
    } catch (error) {
      console.error('Error adding property to cart:', error);
      alert('Failed to add property to cart. Please try again later.');
    }
  };

  return (
    <div className="ltn__shop-details-area pb-10">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <div className="ltn__shop-details-inner ltn__page-details-inner mb-60">
              <div className="ltn__blog-meta">
                <div className="ltn__property-details-gallery mb-30">
                  <div className="row">
                    <div className="col-md-6">
                      <a data-rel="lightcase:myCollection">
                        <img className="mb-30" src={propertyData.coverPhoto?.url} alt="Property Cover" />
                      </a>
                      <a data-rel="lightcase:myCollection">
                        <h4 className="title-2">360° View</h4>
                        <Pannellum
                          width="100%"
                          height="400px"
                          image="https://i0.wp.com/digital-photography-school.com/wp-content/uploads/2014/05/real-estate-photography-interior-after.jpg?fit=862%2C631&ssl=1"
                          pitch={10}
                          yaw={180}
                          hfov={110}
                          autoLoad
                          author="Askun"
                          title="360° View"
                        />
                      </a>
                    </div>
                  </div>
                </div>
                <label><span className="ltn__secondary-color"><i className="flaticon-pin" /></span> Belmont Gardens, Chicago</label>
                <h4 className="title-2">Description</h4>
                <p>{propertyData.description}</p>
                <div className="property-detail-info-list section-bg-1 clearfix mb-60">
                  <ul>
                    <li><label>Property ID:</label> <span>{propertyData.id}</span></li>
                    <li><label>Home Area: </label> <span>{propertyData.area}</span></li>
                    <li><label>Rooms:</label> <span>{propertyData.rooms}</span></li>
                    <li><label>Baths:</label> <span>{propertyData.baths}</span></li>
                    <li><label>Property Status:</label> <span>{propertyData.purpose}</span></li>
                    <li><label>Year built:</label> <span>{propertyData.agency?.createdAt}</span></li>
                    <li><label>Price:</label><span>{propertyData.price}<label>USD</label></span></li>
                  </ul>
                </div>
                <h4 className="title-2 mb-10">Amenities</h4>
                <div className="property-details-amenities mb-60">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="ltn__menu-widget">
                        <ul>
                          {propertyData.amenities?.map((amenity, index) => (
                            <li key={index}>
                              <label className="checkbox-item">{amenity}</label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => addToCart(propertyData)} className="theme-btn-1 btn black-btn" style={{ backgroundColor: '#000000', color: '#ffffff', border: 'none', borderRadius: '20px', padding: '12px 20px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopDetails;
