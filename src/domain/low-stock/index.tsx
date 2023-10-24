import { useQuery } from "@tanstack/react-query";

import api from "../../services/api";
import { Button } from "@medusajs/ui";
import { useNavigate } from "react-router-dom";
import PageDescription from "../../components/atoms/page-description";
import moment from "moment";

const LowStock = () => {
  const { data } = useQuery({
    queryFn: () => api.lowStock.list(),
    queryKey: ["lowStock"],
  });
  const lowProducts = data?.data;
  const navigate = useNavigate();
  return (
    <div>
      <PageDescription
        title="Low Stock Notification"
        subtitle="The jobs will be updated every 12 hours"
      />

      {lowProducts?.map((lowProduct) => (
        <div className="border p-4 shadow-sm mb-4 bg-white flex">
          <div className="">
            <div> {lowProduct.product.title}</div>
            <div className="text-gray-500">
              {lowProduct.product_variant.title}
            </div>
            <div className="text-gray-500 text-xs">
              Last Updated:{" "}
              {moment(lowProduct.updated_at).format("DD/MM/YYYY H:mm A")}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div>
              Stock left:{" "}
              <span className="font-bold">{lowProduct.inventory_quantity}</span>
            </div>
            <Button
              onClick={() => navigate(`/a/products/${lowProduct.product_id}`)}
            >
              Update inventory
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LowStock;
