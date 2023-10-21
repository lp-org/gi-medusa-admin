import { Route, Routes } from "react-router-dom";
import { PriceListEdit } from "./edit";

import { PriceListOverview } from "./overview";
import { PriceListNew } from "./new/new";

const PriceListRoute = () => {
  return (
    <Routes>
      <Route index element={<PriceListOverview />} />
      <Route path="new" element={<PriceListNew />} />
      <Route path=":id" element={<PriceListEdit />} />
    </Routes>
  );
};

export default PriceListRoute;
