"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [currentFilterType, setCurrentFilterType] = useState('all');
  //  const [theme, setTheme] = useState(true)
 const [theme, setTheme] = useState(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme !== null) {
      setTheme(JSON.parse(savedTheme));
    } else {
      setTheme(true); // default to light theme
    }
  }, []);

    useEffect(() =>{
    localStorage.setItem('theme', JSON.stringify(theme))
  }, [theme]) 
  

  const handleTheme = () => {
    setTheme(prevTheme => !prevTheme)

  }

  const handleToggle = (idx) => {
    // setFilterData(prevData => 
    //   prevData.map((item, i) =>
    //    idx === i ? {...item, isActive: !item.isActive} : item
    //   )    
    // )

    // alternatively for updating datas so it can be in sync with filterData
    const correctObject = filterData[idx]
    const updated = datas.map((item, i) =>
       item.name === correctObject.name ? {...item, isActive: !item.isActive} : item
      )    
      setData(updated)

      if(currentFilterType === 'active') {
       return setFilterData(updated.filter(item => item.isActive))
      }
      else if(currentFilterType === 'inActive'){
        return setFilterData(updated.filter(item => !item.isActive))
      }
      else{
         setFilterData(updated)
      }
  }

  const handleFilter = (filterType) => {
    setCurrentFilterType(filterType)

    if(filterType === "all"){
     return setFilterData(datas)
    }
    else if(filterType === 'active'){
     return setFilterData(datas.filter(item => item.isActive)
    )
  }
     else if(filterType === 'inActive') {
     return setFilterData(datas.filter(item => !item.isActive)
    )}
    // else{
    //   setFilterData(updated)
    // }
  }

  const handleRemove = (idx) => {

    const updatedObj = filterData[idx]
    const updatedData = datas.filter(item => item.name !== updatedObj.name
    )

    setData(updatedData)

    if(currentFilterType === 'active') {
      return setFilterData(updatedData.filter(item => item.isActive))
    }
    else if(currentFilterType === 'inActive') {
      return setFilterData(updatedData.filter(item => !item.isActive))
    }

    else{
      setFilterData(updatedData)
    }

  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch("/data.json");
        const response = await data.json();
        setData(response);
        setFilterData(response)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  
 // While theme is still loading, render nothing or a placeholder
  // if (theme === null) {
  //   return <div className={styles.container}></div>;
  // }

  if (theme === null) {
    return <div style={{ visibility: "hidden" }} />;
  }
  return (
    <div className={`${styles.container} ${theme === false ? styles.darkMode : ""}`}>
      <main className={styles.main}>
        <section className={styles.header}>
          <div className={styles.headerLogo}>
            <Image
              src="/assets/images/logo.svg"
              alt="Logo"
              width={150}
              height={40}
              style={{ cursor: "pointer" }}
              //  style={{ backgroundColor: 'red' }}
            />

            <div className={styles.iconSunContainer} onClick={handleTheme}>
              <Image
                src={theme ? "/assets/images/icon-sun.svg" : "/assets/images/icon-moon.svg"}
                alt="Logo"
                width={40}
                height={20}
                //  style={{ backgroundColor: 'red' }}
              />
            </div>
          </div>
        </section>

        <section className={styles.extensionListContainer}>
          <div className={styles.extensionListHeader}>
            <h1 className={styles.extensionListTitle}>Extensions List</h1>
            <div className={styles.extensionListBtn}>
              <button onClick={()=> handleFilter('all')}>All</button> 
              <button onClick={()=> handleFilter('active')}>Active</button>
              <button onClick={()=> handleFilter('inActive')}>Inactive</button>
            </div>
          </div>
        </section>

        <section className={styles.extensionCardBody}>
          {filterData &&
            filterData.map((item, index) => {
              return (
                <section
                  className={styles.extensionCardsContainer}
                  key={item.name}
                >
                  <div className={styles.extensionCard}>
                    <Image
                      src={item.logo}
                      alt={item.logo}
                      width={50}
                      height={50}
                      // style={{backgroundColor: "green"}}
                    />
                    <div className={styles.extensionCardContent}>
                      <h2 className={styles.extensionCardTitle}>{item.name}</h2>
                      <p className={styles.extensionCardDescription}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className={styles.extensionCardActions}>
                    <button className={styles.extensionCardButton} onClick={() => handleRemove(index)}>
                      Remove
                    </button>
                    <button className={`${styles.extensionCardBtnToggle} ${item.isActive === true ? styles.active : ''}`} onClick={() => handleToggle(index)}>
                      <span className={`${item.isActive === true ? styles.active  : ''}`}></span>
                    </button>
                  </div>
                </section>
              );
            })}
        </section>
      </main>
    </div>
  );
}
