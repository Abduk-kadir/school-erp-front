import React, { useEffect, useState } from "react";
import StaffRegistrationComponent from "../../../components/child/staff/staffRegistrationComponent";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";

const staffRegistrationPage = () => {
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    const fetchCarsoul = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/carsoul`);
        setCarouselImages(response?.data?.data || []);
      } catch (error) {
        console.error("Failed to load carousel images:", error);
        setCarouselImages([]);
      }
    };
    fetchCarsoul();
  }, []);

  return (
    <div>
      <StaffRegistrationComponent carouselImages={carouselImages} />
    </div>
  );
};

export default staffRegistrationPage;
