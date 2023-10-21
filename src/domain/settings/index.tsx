import React from "react";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SettingsCard from "../../components/atoms/settings-card";
import Spacer from "../../components/atoms/spacer";
import SettingContainer from "../../components/extensions/setting-container";
import SettingsPageErrorElement from "../../components/extensions/setting-container/setting-error-element";
import FeatureToggle from "../../components/fundamentals/feature-toggle";
import ArrowUTurnLeft from "../../components/fundamentals/icons/arrow-uturn-left";
import ChannelsIcon from "../../components/fundamentals/icons/channels-icon";
import CoinsIcon from "../../components/fundamentals/icons/coins-icon";
import CrosshairIcon from "../../components/fundamentals/icons/crosshair-icon";
import GearIcon from "../../components/fundamentals/icons/gear-icon";
import HappyIcon from "../../components/fundamentals/icons/happy-icon";
import KeyIcon from "../../components/fundamentals/icons/key-icon";
import MapPinIcon from "../../components/fundamentals/icons/map-pin-icon";
import TaxesIcon from "../../components/fundamentals/icons/taxes-icon";
import UsersIcon from "../../components/fundamentals/icons/users-icon";
import { useSettings } from "../../providers/setting-provider";
import CurrencySettings from "./currencies";
import Details from "./details";
import PersonalInformation from "./personal-information";
import Regions from "./regions";
import ReturnReasons from "./return-reasons";
import Taxes from "./taxes";
import Users from "./users";

import Roles from "./roles";
import { useIsPermission } from "../../hooks/use-is-permission";
import StoreContent from "./content";
import SettingsOverview from "../../components/templates/settings-overview";
import DollarSignIcon from "../../components/fundamentals/icons/dollar-sign-icon";

const SettingsIndex = () => {
  const isPermission = useIsPermission();

  return (
    <SettingsOverview>
      {isPermission("setting.reigons") && (
        <SettingsCard
          heading={"Regions"}
          description={"Manage the markets you will operate within"}
          icon={<MapPinIcon />}
          to={`/a/settings/regions`}
        />
      )}
      {isPermission("setting.currencies") && (
        <SettingsCard
          heading={"Currencies"}
          description={"Manage the markets you will operate within"}
          icon={<CoinsIcon />}
          to={`/a/settings/currencies`}
        />
      )}
      {isPermission("setting.store-details") && (
        <SettingsCard
          heading={"Store Details"}
          description={"Manage your business details"}
          icon={<CrosshairIcon />}
          to={`/a/settings/details`}
        />
      )}
      {/* {isPermission("setting.store-details") && (
        <SettingsCard
          heading={"Shipping"}
          description={"Manage shipping profiles"}
          icon={<TruckIcon />}
          to={`/a/settings/shipping-profiles`}
          disabled={true}
        />
      )} */}
      {isPermission("setting.return-reasons") && (
        <SettingsCard
          heading={"Return Reasons"}
          description={"Manage Order settings"}
          icon={<DollarSignIcon />}
          to={`/a/settings/return-reasons`}
        />
      )}
      {isPermission("setting.the-team") && (
        <SettingsCard
          heading={"The Team"}
          description={"Manage users of your Medusa Store"}
          icon={<UsersIcon />}
          to={`/a/settings/team`}
        />
      )}
      {isPermission("setting.roles") && (
        <SettingsCard
          heading={"Roles"}
          description={"Manage roles"}
          icon={<UsersIcon />}
          to={`/a/settings/role`}
        />
      )}

      <SettingsCard
        heading={"Personal Information"}
        description={"Manage your Medusa profile"}
        icon={<HappyIcon />}
        to={`/a/settings/personal-information`}
      />

      {isPermission("setting.tax") && (
        <SettingsCard
          heading={"Tax Settings"}
          description={"Manage taxes across regions and products"}
          icon={<TaxesIcon />}
          to={`/a/settings/taxes`}
        />
      )}
      {isPermission("setting.sales-channels") && (
        <FeatureToggle featureFlag="sales_channels">
          <SettingsCard
            heading={"Sales channels"}
            description={
              "Control which products are available in which channels"
            }
            icon={<ChannelsIcon />}
            to={`/a/sales-channels`}
          />
        </FeatureToggle>
      )}
      {isPermission("setting.api-key-management") && (
        <FeatureToggle featureFlag="publishable_api_keys">
          <SettingsCard
            heading={"API key management"}
            description={"Create and manage API keys"}
            icon={<KeyIcon />}
            to={`/a/publishable-api-keys`}
          />
        </FeatureToggle>
      )}
      {
        <SettingsCard
          heading={"Content management"}
          description={"Manage your storefront content"}
          icon={<KeyIcon />}
          to={`/a/settings/store-content`}
        />
      }
    </SettingsOverview>
  );
};

const Settings = () => {
  const isPermission = useIsPermission();
  return (
    <Routes>
      <Route index element={<SettingsIndex />} />

      {isPermission("setting.store-details") && (
        <Route path="/details" element={<Details />} />
      )}
      <Route path="/regions/*" element={<Regions />} />
      <Route path="/currencies" element={<CurrencySettings />} />
      <Route path="/return-reasons" element={<ReturnReasons />} />
      <Route path="/team" element={<Users />} />
      <Route path="/role" element={<Roles />} />
      <Route path="/personal-information" element={<PersonalInformation />} />
      <Route path="/taxes" element={<Taxes />} />
      <Route path="/store-content" element={<StoreContent />} />
    </Routes>
  );
};

export default Settings;
