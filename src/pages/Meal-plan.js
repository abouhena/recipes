import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import MealList from "../MealList";


const MealPlan = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  const [mealData, setMealData] = useState(null);
  const [calories, setCalories] = useState(2000);

  function getMealData() {
    fetch(
      `https://api.spoonacular.com/mealplanner/generate?apiKey=2798c7ccb62a40b18fd435918ebb4e7d&timeFrame=day&targetCalories=${calories}`
    )
      .then((response) => response.json())
      .then((data) => {
        setMealData(data);
      })
      .catch(() => {
        console.log("error");
      });
  }

  function handleChange(e) {
    setCalories(e.target.value);
  }

  return (
    <div className="create-recipe">
      <input
        type="number"
        placeholder="Calories (e.g. 2000)"
        onChange={handleChange}
      />
      <button onClick={getMealData}>Get Daily Meal Plan</button>
      {mealData && <MealList mealData={mealData} />}
    </div>
  );
};

export default MealPlan;
