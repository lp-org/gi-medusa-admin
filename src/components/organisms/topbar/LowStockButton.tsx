import React from "react";
import TagIcon from "../../fundamentals/icons/tag-icon";
import NotificationBell from "../../molecules/notification-bell";

import { useQuery } from "@tanstack/react-query";
import api from "../../../services/api";
import Button from "../../fundamentals/button";
import { useNavigate } from "react-router-dom";

const LowStockButton = () => {
  const { data: count } = useQuery({
    queryFn: () => api.lowStock.count(),
    queryKey: ["lowStockCount"],
  });
  const navigate = useNavigate();
  return (
    <div>
      <Button
        size="small"
        variant="ghost"
        className="mr-3 h-8 w-full"
        onClick={() => navigate(`/a/low-stock`)}
      >
        <div className="flex items-center gap-2">
          <TagIcon size={24} /> Low Inventory
          {count?.data > 0 && (
            <span className="rounded-full bg-red-500 text-white text-xs p-1 w-4 h-4 flex items-center">
              {count?.data}
            </span>
          )}
        </div>
      </Button>
    </div>
  );
};

export default LowStockButton;
