import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Touchable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../theme";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { useCallback, useState, useEffect } from "react";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecase } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from "react-native-progress";
import { storeData } from "../utils/asyncStorage";

const backgroundImage = require("../assets/images/bg.png");
const partlyCloudImage = require("../assets/images/partlycloudy.png");
const windicon = require("../assets/icons/wind.png");
const dropicon = require("../assets/icons/drop.png");
const sunicon = require("../assets/icons/sun.png");

export const Home = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLocation = (loc) => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecase({ cityName: loc.name, days: "7" }).then((data) => {
      setWeather(data);
      setLoading(false);
      storeData("city", loc.name);
    });
  };

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData("city");
    let cityName = "Hyderabad";
    if (myCity) {
      cityName = myCity;
    }
    fetchWeatherForecase({
      cityName: "Hyderabad",
      days: "7",
    }).then((data) => {
      setWeather(data);
    });
  };
  const { current, location } = weather;
  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        source={backgroundImage}
        blurRadius={70}
        className="absolute w-full h-full"
      ></Image>
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          <View style={{ height: "7%" }} className="mx-4 relative z-50">
            <View
              className="flex-row justify-end items-center rounded-full"
              style={{
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : "transparent",
              }}
            >
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search city"
                  placeholderTextColor={"lightgray"}
                  className="pl-6 h-10 flex-1 text-base text-white"
                ></TextInput>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  toggleSearch(!showSearch);
                }}
                style={{ backgroundColor: theme.bgWhite(0.2) }}
                className="rounded-full p-3 m-1"
              >
                <MagnifyingGlassIcon
                  size={25}
                  color="white"
                ></MagnifyingGlassIcon>
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-20 rounded-3xl">
                {locations.map((loc, idx) => {
                  let showBorder = idx + 1 !== locations.length ? true : false;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      className={
                        "flex-row items-center p-3 px-4 mb-1 " + borderClass
                      }
                      key={idx}
                    >
                      <MapPinIcon size={20} color="gray"></MapPinIcon>
                      <Text className="text-black text-lg ml-2">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          {/* forecast section */}
          <View className="mx-4 flex justify-around flex-1 mb-2">
            <Text className="text-white text-center text-2xl font-bold">
              {location?.name},
              <Text className="text-lg font-semibold text-gray-300">
                {location?.country}
              </Text>
            </Text>
            {/* Weather */}
            <View className="flex-row justify-center">
              <Image
                source={weatherImages[current?.condition?.text]}
                className="w-52 h-52"
              ></Image>
            </View>
          </View>
          {/* degree celsius */}
          <View className="space-y-2">
            <Text className="text-center font-bold text-white text-6xl ml-5">
              {current?.temp_c}&#176;
            </Text>
            <Text className="text-center text-white text-xl tracking-widest">
              {current?.condition?.text}
            </Text>
          </View>
          {/* other stats */}
          <View className="flex-row justify-between mx-4 mt-10">
            <View className="flex-row space-x-2 items-center">
              <Image source={windicon} className="w-6 h-6"></Image>
              <Text className="text-white font-semibold text-base">
                {current?.wind_kph}km
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image source={dropicon} className="w-6 h-6"></Image>
              <Text className="text-white font-semibold text-base">
                {current?.humidity}%
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              <Image source={sunicon} className="w-6 h-6"></Image>
              <Text className="text-white font-semibold text-base">
                {weather?.forecast?.forecastday[0]?.astro?.sunrise}
              </Text>
            </View>
          </View>
          {/* forecast for next days  */}
          <View className="mb-5 space-y-3 mt-10">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size={22} color={"white"} />
              <Text className="text-white text-base">Daily Forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map((item, index) => {
                const date = new Date(item.date);
                let options = { weekday: "long" };
                let dayName = date.toLocaleDateString("en-US", options);
                dayName = dayName.split(",")[0];
                return (
                  <View
                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                    style={{ backgroundColor: theme.bgWhite(0.15) }}
                  >
                    <Image
                      source={
                        weatherImages[item?.day?.condition?.text || "other"]
                      }
                      className="h-11 w-11"
                    ></Image>
                    <Text className="text-white">{dayName}</Text>
                    <Text className="text-white text-xl font-semibold">
                      {" "}
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};
