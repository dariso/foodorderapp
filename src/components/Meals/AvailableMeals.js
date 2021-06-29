import React, { useEffect, useState } from 'react';
import Card from '../UI/Card';
import MealItem from '../Meals/MealItem/MealItem';
import Spinner from '../UI/Spinner';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await fetch('https://food-order-app-efa84-default-rtdb.firebaseio.com/meals.json');
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error('There was a problem fetching the meals, please try again later.');
      }

      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }
      setMeals(loadedMeals);
      setIsLoading(false);
    };

    fetchMeals().catch((error) => {
      setIsLoading(false);
      setErrorMessage('There was a problem getting your meals, please try later.');
    });
  }, []);

  const mealList = meals.map((meal) => {
    return <MealItem name={meal.name} id={meal.id} key={meal.id} price={meal.price} description={meal.description} />;
  });
  return (
    <section className={classes.meals}>
      <Card>
        {isLoading && <Spinner />}
        {!isLoading && errorMessage && <p>{errorMessage}</p>}
        {!isLoading && !errorMessage && <ul>{mealList}</ul>}
      </Card>
    </section>
  );
};

export default AvailableMeals;
