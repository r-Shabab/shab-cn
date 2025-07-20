import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "https://restcountries.com/v3.1";

// Define a type for country data
export type Country = {
  name: string;
  isoCode: string;
  isdCode: string;
  flag: string;
};

// Utility to format raw API data
type RawCountry = {
  name: { common: string };
  cca2: string;
  idd?: { root?: string; suffixes?: string[] };
  flags?: { svg?: string };
};

const formatCountry = (country: RawCountry): Country => ({
  name: country.name.common,
  isoCode: country.cca2,
  isdCode: country.idd?.root
    ? `${country.idd.root}${country.idd.suffixes?.[0] ?? ""}`
    : "",
  flag: country.flags?.svg ?? "",
});

const fetchAllCountries = async () => {
  const res = await axios.get(`${BASE_URL}/all?fields=name,cca2,idd,flags`);
  return res.data.map(formatCountry);
};

const fetchSingleCountry = async (cca2: string) => {
  const res = await axios.get(
    `${BASE_URL}/alpha/${cca2}?fields=name,cca2,idd,flags`,
  );
  return formatCountry(res.data[0] ?? res.data);
};

// Hook to fetch all countries
export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: () => fetchAllCountries(),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

// Hook to fetch a single country by cca2 ISO code
export const useCountry = (cca2: string) => {
  return useQuery<Country>({
    queryKey: ["country", cca2],
    queryFn: () => fetchSingleCountry(cca2),
    enabled: !!cca2, // only fetch if cca2 is provided
    refetchOnWindowFocus: false,
    retry: false,
  });
};
