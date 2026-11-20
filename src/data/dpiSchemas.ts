/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AgroPulse AI - India AgriTech DPI (Digital Public Infrastructure) Schemas & Data Engine
 * Aligned with:
 * - AgriStack / UFSI (Unique Farmer Service Interface)
 * - State Land Records (Bhulekh / Dharani / Bhoomi / MahaBhulekh)
 * - Digital Crop Survey (e-Panta / CROPIC)
 * - ONDC (Open Network for Digital Commerce) Agri Protocol
 * - e-NAM (National Agriculture Market) Mandi Benchmarks
 */

export interface AgriStackFarmerProfile {
  schema_version: "agristack.farmer.v2.1";
  farmer_id: string; // UFSI: e.g. "UFSI-IND-MH-2024-998412"
  aadhaar_masked: string; // "XXXX-XXXX-4812"
  digilocker_consent_id: string;
  digilocker_verified: boolean;
  verification_timestamp: string;
  farmer_name: string;
  gender: "Male" | "Female" | "Other";
  mobile_number: string;
  state_lgd_code: number;
  state_name: string;
  district_name: string;
  sub_district_tehsil: string;
  village_lgd_code: number;
  village_name: string;
  bank_account_verified: boolean;
  npci_dbt_enabled: boolean;
  upi_vpa: string;
  fpo_membership_id?: string;
  primary_crops: string[];
}

export interface BhulekhLandParcel {
  schema_version: "bhulekh.land_parcel.v1.4";
  land_record_id: string; // e.g. "BHULEKH-MH-PUN-JUN-0842"
  state_portal: "MahaBhulekh (MH)" | "Bhoomi (KA)" | "Dharani (TG)" | "Bhulekh (UP)" | "MeeBhoomi (AP)";
  state_name: string;
  district_name: string;
  tehsil_mandal: string;
  village_name: string;
  khasra_survey_number: string; // Khasra / Survey / Khatauni Number, e.g. "74/2A"
  khata_number: string;
  recorded_owner_name: string;
  ownership_type: "Owner-Cultivator" | "Tenant Farmer (Patta)" | "Sharecropper";
  total_parcel_area_acres: number;
  net_sown_area_acres: number;
  net_sown_area_hectares: number;
  soil_health_card_id: string;
  soil_type: string;
  irrigation_source: "Micro-Drip Solar" | "Canal Feed" | "Borewell Grid" | "Rainfed";
  epanta_geo_polygon: [number, number][]; // Array of [lat, lng] coordinates
  digital_crop_survey_ref: string;
  verified_by_patwari: boolean;
  verification_date: string;
}

export interface FarmerPoolCluster {
  schema_version: "agropulse.fpo_cluster.v2.0";
  fpo_cluster_id: string; // e.g. "FPO-SAHYADRI-PUN-04"
  fpo_name: string;
  nodal_district: string;
  block_tehsil: string;
  geo_center: {
    lat: number;
    lng: number;
  };
  geo_radius_km: number;
  crop_name: string;
  crop_variety: string;
  hsn_code: string; // e.g. "07020000" for Tomatoes
  enrolled_farmers_count: number;
  active_sown_acres: number;
  aggregated_yield_quintals: number;
  msp_benchmark_price_per_qtl: number;
  mandi_benchmark_price_per_qtl: number; // e-NAM live modal price
  guaranteed_floor_price_per_qtl: number; // AgroPulse algorithm output
  demand_committed_quintals: number;
  demand_coverage_percent: number;
  nearest_solar_godown: string;
  nearest_godown_distance_km: number;
  cluster_lead_officer: string;
  status: "Active Sowing" | "Harvest Window Open" | "Fully Committed";
}

export interface ONDCConsumerDemand {
  schema_version: "ondc.agri_demand.v1.2";
  demand_id: string; // e.g. "ONDC-DEM-2024-8841"
  buyer_persona: "Individual Household" | "HoReCa / Restaurant" | "Institutional Buyer" | "Kirana / Retailer";
  buyer_name: string;
  buyer_contact: string;
  city_metro: string;
  pincode: string;
  delivery_sla_window: "15-Min Ultra-Fast" | "Same Day Evening" | "Scheduled Next Morning";
  crop_name: string;
  crop_variety: string;
  hsn_code: string;
  quality_grade: "Grade A+ Organic (PGS-India)" | "NPOP Certified Export" | "Zero-Budget Natural Farming (ZBNF)" | "Grade A Residue-Free";
  cadence: "Weekly Farm Box" | "Bi-Weekly Supply" | "Monthly Recurring" | "Forward Harvest Contract";
  committed_quantity_kg: number;
  committed_quantity_quintals: number;
  committed_unit_price_inr_kg: number;
  season: "Kharif 2024-25" | "Rabi 2024-25" | "Zaid 2025";
  order_status: "Forward Contract Locked" | "Dispatched from Godown" | "Fulfilled";
  ondc_transaction_ref: string;
}

export interface CropLineageBatch {
  schema_version: "agropulse.crop_lineage.v3.0";
  lineage_batch_id: string; // e.g. "LIN-MH-TOM-2024-912"
  crop_passport_code: string;
  farmer_id: string;
  farmer_name: string;
  fpo_cluster_id: string;
  fpo_name: string;
  crop_name: string;
  crop_variety: string;
  hsn_code: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  khasra_survey_number: string;
  epanta_geo_coordinates: {
    lat: number;
    lng: number;
  };
  sowing_date: string;
  harvest_timestamp: string;
  cold_chain_dispatch_time: string;
  quality_grade: "Grade A+ Organic (PGS-India)" | "NPOP Certified Export" | "Zero-Budget Natural Farming (ZBNF)";
  certification_body: "PGS-India Green Council" | "NPOP Aditi Organic" | "ZBNF Natural Trust";
  certification_id: string;
  lab_residue_test_status: "Passed (<0.01 ppm Zero Residue)" | "Certified Organic Compliant";
  batch_weight_quintals: number;
  direct_farmer_payout_inr_kg: number;
  platform_fee_inr_kg: number;
  logistics_cost_inr_kg: number;
  consumer_mrp_inr_kg: number;
  traditional_mandi_retail_mrp_kg: number;
  subscriber_count: number;
}

export interface SmartGridRegionAnalytics {
  district: string;
  state: string;
  tehsilCount: number;
  totalSownAcres: number;
  topCrops: { crop: string; sownAcres: number; expectedYieldQuintals: number }[];
  marketDemandQuintals: number;
  projectedSupplyQuintals: number;
  surplusDeficitQuintals: number; // positive = surplus, negative = deficit
  status: "Deficit Alert" | "Balanced Grid" | "Surplus Buffer Needed";
  solarGodownsAvailable: number;
  godownCapacityQuintals: number;
  godownUtilizationPercent: number;
  recommendedAction: string;
}

// =========================================================================
// FLOOR PRICE & POOLING ALGORITHM DEFINITION & PSEUDOCODE
// =========================================================================

export const FLOOR_PRICE_ALGORITHM_DOCS = {
  title: "AgroPulse Data-Backed Minimum Floor Price & Pooling Algorithm",
  formulaLatex: `P_{\\text{floor}} = \\max(\\text{MSP}_{\\text{crop}}, P_{\\text{e-NAM}}) \\times (1 + \\alpha_{\\text{cert}}) + \\beta_{\\text{demand\\_pressure}} + \\gamma_{\\text{pool\\_scale}}`,
  description:
    "Calculates a guaranteed minimum farmgate purchase floor price per quintal by evaluating live central MSP statutory baselines, real-time e-NAM wholesale market modal pricing, organic certification multipliers, pre-committed consumer forward demand orders, and FPO hyper-local scale efficiencies.",
  variables: [
    {
      symbol: "P_base",
      name: "Statutory Base Floor",
      definition: "Maximum of official Central Government MSP and 7-day trailing e-NAM modal mandi price.",
    },
    {
      symbol: "alpha_cert",
      name: "Certification Multiplier",
      definition: "+18% for PGS-India Organic, +22% for NPOP Export, +12% for ZBNF/Natural Farming, +6% for Grade A Farmgate.",
    },
    {
      symbol: "beta_demand",
      name: "Forward Demand Pressure Bonus",
      definition: "Calculated from pre-committed ONDC subscription volume vs sown area. If forward demand exceeds 80% of projected yield, adds ₹120-₹280/Qtl.",
    },
    {
      symbol: "gamma_pool",
      name: "FPO Scale Aggregation Dividend",
      definition: "Savings from collective transport, shared solar godowns, and bulk disintermediation returned 100% to farmers (+₹60-₹150/Qtl).",
    },
  ],
  pseudocode: `// -------------------------------------------------------------
// AgroPulse Dynamic Floor Price & Pooling Algorithm
// -------------------------------------------------------------
function calculateGuaranteedFloorPrice(farmerEnrollment, regionalFpoPool, liveMarketData) {
  // Step 1: Establish Statutory & Live Mandi Baseline
  const mspBaseline = liveMarketData.getCropMSP(farmerEnrollment.crop);
  const eNamModalRate = liveMarketData.getENamModalPrice(farmerEnrollment.crop, farmerEnrollment.district);
  const basePrice = Math.max(mspBaseline, eNamModalRate);

  // Step 2: Quality & Certification Premium
  let certMultiplier = 0.06; // Grade A baseline
  if (farmerEnrollment.certification === "NPOP_ORGANIC") certMultiplier = 0.22;
  else if (farmerEnrollment.certification === "PGS_INDIA") certMultiplier = 0.18;
  else if (farmerEnrollment.certification === "ZBNF_NATURAL") certMultiplier = 0.12;

  // Step 3: Forward Demand Capture Ratio (ONDC Consumer Commitments)
  const committedDemandQtl = regionalFpoPool.getCommittedConsumerDemand();
  const projectedYieldQtl = regionalFpoPool.getTotalProjectedYield();
  const demandCoverageRatio = committedDemandQtl / Math.max(1, projectedYieldQtl);

  let forwardDemandBonus = 0;
  if (demandCoverageRatio >= 1.0) {
    forwardDemandBonus = 240; // ₹240/Qtl premium for 100%+ guaranteed pre-sale
  } else if (demandCoverageRatio >= 0.7) {
    forwardDemandBonus = 150;
  } else if (demandCoverageRatio >= 0.4) {
    forwardDemandBonus = 80;
  }

  // Step 4: Hyper-local FPO Aggregation Dividend (Shared Cold Storage & Logistics)
  // Pooling saves 65% of individual farm-to-mandi cartage
  const clusterAcreage = regionalFpoPool.totalEnrolledAcres;
  const poolScaleBonus = Math.min(150, Math.floor(clusterAcreage * 0.4) + 60);

  // Step 5: Final Guaranteed Floor Price (INR / Quintal)
  const guaranteedFloorPrice = (basePrice * (1 + certMultiplier)) + forwardDemandBonus + poolScaleBonus;

  return {
    guaranteedFloorPricePerQtl: Math.round(guaranteedFloorPrice),
    basePricePerQtl: basePrice,
    organicPremiumInr: Math.round(basePrice * certMultiplier),
    forwardDemandBonusInr: forwardDemandBonus,
    poolScaleDividendInr: poolScaleBonus,
    equivalentPerKgInr: Math.round((guaranteedFloorPrice / 100) * 10) / 10,
    disintermediationMarginIncrease: "+38.4% above traditional Arhatiya net realization"
  };
}`,
};

// =========================================================================
// MOCK DATA & SCHEMAS ALIGNED WITH INDIA DPI
// =========================================================================

export const SAMPLE_AGRISTACK_FARMERS: AgriStackFarmerProfile[] = [
  {
    schema_version: "agristack.farmer.v2.1",
    farmer_id: "UFSI-IND-MH-2024-998412",
    aadhaar_masked: "XXXX-XXXX-4812",
    digilocker_consent_id: "DL-CONSENT-MH-9812-771",
    digilocker_verified: true,
    verification_timestamp: "2024-10-18T10:32:00+05:30",
    farmer_name: "Rameshwar B. Patil",
    gender: "Male",
    mobile_number: "+91 98231 44812",
    state_lgd_code: 27, // Maharashtra
    state_name: "Maharashtra",
    district_name: "Pune",
    sub_district_tehsil: "Junnar",
    village_lgd_code: 556781,
    village_name: "Narayangaon",
    bank_account_verified: true,
    npci_dbt_enabled: true,
    upi_vpa: "rameshwarpatil@ybl",
    fpo_membership_id: "FPO-SAHYADRI-PUN-04",
    primary_crops: ["Roma Tomatoes", "Baby Spinach"],
  },
  {
    schema_version: "agristack.farmer.v2.1",
    farmer_id: "UFSI-IND-MH-2024-884102",
    aadhaar_masked: "XXXX-XXXX-9931",
    digilocker_consent_id: "DL-CONSENT-MH-4421-908",
    digilocker_verified: true,
    verification_timestamp: "2024-10-21T14:15:00+05:30",
    farmer_name: "Sunita Dnyandev Shinde",
    gender: "Female",
    mobile_number: "+91 97654 33210",
    state_lgd_code: 27,
    state_name: "Maharashtra",
    district_name: "Nashik",
    sub_district_tehsil: "Niphad",
    village_lgd_code: 554312,
    village_name: "Pimpalgaon Baswant",
    bank_account_verified: true,
    npci_dbt_enabled: true,
    upi_vpa: "sunitashinde@icici",
    fpo_membership_id: "FPO-GODAVARI-NSK-01",
    primary_crops: ["Nashik Red Onions"],
  },
  {
    schema_version: "agristack.farmer.v2.1",
    farmer_id: "UFSI-IND-KA-2024-771904",
    aadhaar_masked: "XXXX-XXXX-6104",
    digilocker_consent_id: "DL-CONSENT-KA-1192-334",
    digilocker_verified: true,
    verification_timestamp: "2024-10-24T09:48:00+05:30",
    farmer_name: "Manjunath Gowda",
    gender: "Male",
    mobile_number: "+91 94481 22904",
    state_lgd_code: 29, // Karnataka
    state_name: "Karnataka",
    district_name: "Kolar",
    sub_district_tehsil: "Srinivaspur",
    village_lgd_code: 612841,
    village_name: "Rayalpadu",
    bank_account_verified: true,
    npci_dbt_enabled: true,
    upi_vpa: "manjugowda@okhdfcbank",
    fpo_membership_id: "FPO-KOLAR-GOLD-02",
    primary_crops: ["Alphonso Mangoes", "Roma Tomatoes"],
  },
];

export const SAMPLE_BHULEKH_PARCELS: BhulekhLandParcel[] = [
  {
    schema_version: "bhulekh.land_parcel.v1.4",
    land_record_id: "BHULEKH-MH-PUN-JUN-0842",
    state_portal: "MahaBhulekh (MH)",
    state_name: "Maharashtra",
    district_name: "Pune",
    tehsil_mandal: "Junnar",
    village_name: "Narayangaon",
    khasra_survey_number: "74/2A",
    khata_number: "KH-318",
    recorded_owner_name: "Rameshwar B. Patil",
    ownership_type: "Owner-Cultivator",
    total_parcel_area_acres: 4.8,
    net_sown_area_acres: 4.2,
    net_sown_area_hectares: 1.7,
    soil_health_card_id: "SHC-MH-2024-8841",
    soil_type: "Medium Black Fertile Soil (pH 7.1)",
    irrigation_source: "Micro-Drip Solar",
    epanta_geo_polygon: [
      [19.1242, 73.9781],
      [19.1258, 73.9805],
      [19.1235, 73.9822],
      [19.1219, 73.9798],
    ],
    digital_crop_survey_ref: "EPANTA-MH-2024-KHARIF-4128",
    verified_by_patwari: true,
    verification_date: "2024-09-14",
  },
  {
    schema_version: "bhulekh.land_parcel.v1.4",
    land_record_id: "BHULEKH-MH-NSK-NIP-1109",
    state_portal: "MahaBhulekh (MH)",
    state_name: "Maharashtra",
    district_name: "Nashik",
    tehsil_mandal: "Niphad",
    village_name: "Pimpalgaon Baswant",
    khasra_survey_number: "112/4B",
    khata_number: "KH-482",
    recorded_owner_name: "Sunita Dnyandev Shinde",
    ownership_type: "Owner-Cultivator",
    total_parcel_area_acres: 6.5,
    net_sown_area_acres: 5.8,
    net_sown_area_hectares: 2.35,
    soil_health_card_id: "SHC-MH-2024-9912",
    soil_type: "Rich Alluvial Silt (pH 6.8)",
    irrigation_source: "Borewell Grid",
    epanta_geo_polygon: [
      [20.1712, 74.0381],
      [20.1735, 74.0412],
      [20.1702, 74.0435],
      [20.1681, 74.0401],
    ],
    digital_crop_survey_ref: "EPANTA-MH-2024-KHARIF-9910",
    verified_by_patwari: true,
    verification_date: "2024-09-22",
  },
];

export const SAMPLE_FPO_CLUSTERS: FarmerPoolCluster[] = [
  {
    schema_version: "agropulse.fpo_cluster.v2.0",
    fpo_cluster_id: "FPO-SAHYADRI-PUN-04",
    fpo_name: "Sahyadri Bio-Farming Producer Company Ltd.",
    nodal_district: "Pune",
    block_tehsil: "Junnar / Ambegaon",
    geo_center: { lat: 19.1245, lng: 73.9801 },
    geo_radius_km: 18.5,
    crop_name: "Roma Tomatoes",
    crop_variety: "Abhinav F1 / Desi Hybrid",
    hsn_code: "07020000",
    enrolled_farmers_count: 148,
    active_sown_acres: 385,
    aggregated_yield_quintals: 4620,
    msp_benchmark_price_per_qtl: 1850,
    mandi_benchmark_price_per_qtl: 2150, // e-NAM live rate
    guaranteed_floor_price_per_qtl: 2950, // AgroPulse guaranteed floor
    demand_committed_quintals: 4200,
    demand_coverage_percent: 91,
    nearest_solar_godown: "Junnar Solar Micro-Cold Room #02",
    nearest_godown_distance_km: 4.8,
    cluster_lead_officer: "Dr. Aniket Deshmukh (AgriStack Lead)",
    status: "Active Sowing",
  },
  {
    schema_version: "agropulse.fpo_cluster.v2.0",
    fpo_cluster_id: "FPO-GODAVARI-NSK-01",
    fpo_name: "Godavari Valley Farmers Producer Co-op",
    nodal_district: "Nashik",
    block_tehsil: "Niphad / Yeola",
    geo_center: { lat: 20.1715, lng: 74.0402 },
    geo_radius_km: 24.0,
    crop_name: "Nashik Red Onions",
    crop_variety: "Garwa / N-53 Red",
    hsn_code: "07031010",
    enrolled_farmers_count: 212,
    active_sown_acres: 640,
    aggregated_yield_quintals: 7680,
    msp_benchmark_price_per_qtl: 1400,
    mandi_benchmark_price_per_qtl: 1720,
    guaranteed_floor_price_per_qtl: 2380,
    demand_committed_quintals: 6800,
    demand_coverage_percent: 88,
    nearest_solar_godown: "Niphad Multi-Commodity Solar Store",
    nearest_godown_distance_km: 6.2,
    cluster_lead_officer: "Vikas Shelke (FPO Coordinator)",
    status: "Active Sowing",
  },
  {
    schema_version: "agropulse.fpo_cluster.v2.0",
    fpo_cluster_id: "FPO-KOLAR-GOLD-02",
    fpo_name: "Kolar Horticultural FPO Consortium",
    nodal_district: "Kolar",
    block_tehsil: "Srinivaspur / Mulbagal",
    geo_center: { lat: 13.1362, lng: 78.1291 },
    geo_radius_km: 22.0,
    crop_name: "Alphonso Mangoes",
    crop_variety: "Ratnagiri Grafted Semi-Dwarf",
    hsn_code: "08045020",
    enrolled_farmers_count: 94,
    active_sown_acres: 290,
    aggregated_yield_quintals: 2320,
    msp_benchmark_price_per_qtl: 3800,
    mandi_benchmark_price_per_qtl: 5200,
    guaranteed_floor_price_per_qtl: 7400,
    demand_committed_quintals: 2100,
    demand_coverage_percent: 90,
    nearest_solar_godown: "Srinivaspur Fruit Pre-Cooling Hub",
    nearest_godown_distance_km: 3.5,
    cluster_lead_officer: "Suresh Gowda",
    status: "Active Sowing",
  },
];

export const SAMPLE_ONDC_DEMANDS: ONDCConsumerDemand[] = [
  {
    schema_version: "ondc.agri_demand.v1.2",
    demand_id: "ONDC-DEM-2024-8841",
    buyer_persona: "Individual Household",
    buyer_name: "Pooja & Sameer Verma",
    buyer_contact: "+91 98201 11204",
    city_metro: "Mumbai (Khar West)",
    pincode: "400052",
    delivery_sla_window: "15-Min Ultra-Fast",
    crop_name: "Roma Tomatoes",
    crop_variety: "Organic Vine-Ripened",
    hsn_code: "07020000",
    quality_grade: "Grade A+ Organic (PGS-India)",
    cadence: "Weekly Farm Box",
    committed_quantity_kg: 18,
    committed_quantity_quintals: 0.18,
    committed_unit_price_inr_kg: 38,
    season: "Kharif 2024-25",
    order_status: "Forward Contract Locked",
    ondc_transaction_ref: "ONDC-BAP-MUM-88129-01",
  },
  {
    schema_version: "ondc.agri_demand.v1.2",
    demand_id: "ONDC-DEM-2024-9902",
    buyer_persona: "HoReCa / Restaurant",
    buyer_name: "Bombay Canteen & O Pedro Hospitality",
    buyer_contact: "+91 98334 55901",
    city_metro: "Mumbai (Lower Parel)",
    pincode: "400013",
    delivery_sla_window: "Scheduled Next Morning",
    crop_name: "Nashik Red Onions",
    crop_variety: "Garwa Export Grade",
    hsn_code: "07031010",
    quality_grade: "Grade A Residue-Free",
    cadence: "Monthly Recurring",
    committed_quantity_kg: 850,
    committed_quantity_quintals: 8.5,
    committed_unit_price_inr_kg: 28,
    season: "Kharif 2024-25",
    order_status: "Forward Contract Locked",
    ondc_transaction_ref: "ONDC-BAP-HORECA-4491-92",
  },
  {
    schema_version: "ondc.agri_demand.v1.2",
    demand_id: "ONDC-DEM-2024-6621",
    buyer_persona: "Kirana / Retailer",
    buyer_name: "Lakshmi Organic Store",
    buyer_contact: "+91 99801 44102",
    city_metro: "Bengaluru (Indiranagar)",
    pincode: "560038",
    delivery_sla_window: "Same Day Evening",
    crop_name: "Alphonso Mangoes",
    crop_variety: "Carbide-Free Ripened",
    hsn_code: "08045020",
    quality_grade: "Grade A+ Organic (PGS-India)",
    cadence: "Forward Harvest Contract",
    committed_quantity_kg: 240,
    committed_quantity_quintals: 2.4,
    committed_unit_price_inr_kg: 120,
    season: "Zaid 2025",
    order_status: "Forward Contract Locked",
    ondc_transaction_ref: "ONDC-BAP-BLR-KIRANA-110",
  },
];

export const SAMPLE_CROP_LINEAGE_BATCHES: CropLineageBatch[] = [
  {
    schema_version: "agropulse.crop_lineage.v3.0",
    lineage_batch_id: "LIN-MH-TOM-2024-912",
    crop_passport_code: "PASSPORT-742A-TOM-PUN",
    farmer_id: "UFSI-IND-MH-2024-998412",
    farmer_name: "Rameshwar B. Patil",
    fpo_cluster_id: "FPO-SAHYADRI-PUN-04",
    fpo_name: "Sahyadri Bio-Farming FPO",
    crop_name: "Roma Tomatoes",
    crop_variety: "Abhinav F1 Bio-Natural",
    hsn_code: "07020000",
    state: "Maharashtra",
    district: "Pune",
    tehsil: "Junnar",
    village: "Narayangaon",
    khasra_survey_number: "Khasra 74/2A",
    epanta_geo_coordinates: { lat: 19.1242, lng: 73.9781 },
    sowing_date: "2024-07-12",
    harvest_timestamp: "2024-10-24T06:15:00+05:30",
    cold_chain_dispatch_time: "2024-10-24T07:45:00+05:30 (Chilled to 8°C in 90 min)",
    quality_grade: "Grade A+ Organic (PGS-India)",
    certification_body: "PGS-India Green Council",
    certification_id: "PGS-IND-MH-88194",
    lab_residue_test_status: "Passed (<0.01 ppm Zero Residue)",
    batch_weight_quintals: 28.5,
    direct_farmer_payout_inr_kg: 29.5, // 77.6% payout
    platform_fee_inr_kg: 1.3, // 3.4% fee
    logistics_cost_inr_kg: 2.9, // 7.6% cold chain & dark store
    consumer_mrp_inr_kg: 38.0,
    traditional_mandi_retail_mrp_kg: 55.0, // Traditional mandi middleman price
    subscriber_count: 142,
  },
  {
    schema_version: "agropulse.crop_lineage.v3.0",
    lineage_batch_id: "LIN-MH-ONN-2024-401",
    crop_passport_code: "PASSPORT-1124-ONN-NSK",
    farmer_id: "UFSI-IND-MH-2024-884102",
    farmer_name: "Sunita Dnyandev Shinde",
    fpo_cluster_id: "FPO-GODAVARI-NSK-01",
    fpo_name: "Godavari Valley Farmers Producer Co-op",
    crop_name: "Nashik Red Onions",
    crop_variety: "Garwa Export Grade",
    hsn_code: "07031010",
    state: "Maharashtra",
    district: "Nashik",
    tehsil: "Niphad",
    village: "Pimpalgaon Baswant",
    khasra_survey_number: "Khasra 112/4B",
    epanta_geo_coordinates: { lat: 20.1712, lng: 74.0381 },
    sowing_date: "2024-06-28",
    harvest_timestamp: "2024-10-22T05:30:00+05:30",
    cold_chain_dispatch_time: "2024-10-22T08:00:00+05:30 (Solar Dry Cure & Dehumidify)",
    quality_grade: "Grade A+ Organic (PGS-India)",
    certification_body: "ZBNF Natural Trust",
    certification_id: "ZBNF-NSK-2024-409",
    lab_residue_test_status: "Passed (<0.01 ppm Zero Residue)",
    batch_weight_quintals: 45.0,
    direct_farmer_payout_inr_kg: 23.8,
    platform_fee_inr_kg: 1.0,
    logistics_cost_inr_kg: 2.2,
    consumer_mrp_inr_kg: 30.0,
    traditional_mandi_retail_mrp_kg: 44.0,
    subscriber_count: 310,
  },
];

export const SAMPLE_SMART_GRID_ANALYTICS: SmartGridRegionAnalytics[] = [
  {
    district: "Pune",
    state: "Maharashtra",
    tehsilCount: 14,
    totalSownAcres: 48200,
    topCrops: [
      { crop: "Roma Tomatoes", sownAcres: 18400, expectedYieldQuintals: 220800 },
      { crop: "Baby Spinach", sownAcres: 6200, expectedYieldQuintals: 49600 },
      { crop: "Green Chillies", sownAcres: 9100, expectedYieldQuintals: 72800 },
    ],
    marketDemandQuintals: 310000,
    projectedSupplyQuintals: 343200,
    surplusDeficitQuintals: 33200, // surplus
    status: "Surplus Buffer Needed",
    solarGodownsAvailable: 8,
    godownCapacityQuintals: 45000,
    godownUtilizationPercent: 78,
    recommendedAction: "Pre-allocate 14,000 Qtl surplus to Mumbai & Navi Mumbai dark-store fulfillment corridors before price dips.",
  },
  {
    district: "Nashik",
    state: "Maharashtra",
    tehsilCount: 15,
    totalSownAcres: 68500,
    topCrops: [
      { crop: "Nashik Red Onions", sownAcres: 34000, expectedYieldQuintals: 408000 },
      { crop: "Grapes (Bio-Grade)", sownAcres: 18000, expectedYieldQuintals: 162000 },
      { crop: "Tomatoes", sownAcres: 11200, expectedYieldQuintals: 134400 },
    ],
    marketDemandQuintals: 620000,
    projectedSupplyQuintals: 704400,
    surplusDeficitQuintals: 84400, // massive onion surplus
    status: "Surplus Buffer Needed",
    solarGodownsAvailable: 12,
    godownCapacityQuintals: 120000,
    godownUtilizationPercent: 64,
    recommendedAction: "Issue 78% liquidity advances to 2,400 onion farmers. Defer market release by 45 days to avoid post-harvest mandi crashes.",
  },
  {
    district: "Kolar",
    state: "Karnataka",
    tehsilCount: 6,
    totalSownAcres: 32000,
    topCrops: [
      { crop: "Alphonso & Totapuri Mangoes", sownAcres: 14200, expectedYieldQuintals: 113600 },
      { crop: "Tomatoes", sownAcres: 9800, expectedYieldQuintals: 117600 },
    ],
    marketDemandQuintals: 265000,
    projectedSupplyQuintals: 231200,
    surplusDeficitQuintals: -33800, // deficit
    status: "Deficit Alert",
    solarGodownsAvailable: 4,
    godownCapacityQuintals: 28000,
    godownUtilizationPercent: 92,
    recommendedAction: "Forward-contract 35,000 Qtl from Junnar/Pune FPO clusters via Green Corridor freight to stabilize Bengaluru urban retail rates.",
  },
  {
    district: "Warangal",
    state: "Telangana",
    tehsilCount: 13,
    totalSownAcres: 41000,
    topCrops: [
      { crop: "Warangal Red Chillies", sownAcres: 21000, expectedYieldQuintals: 126000 },
      { crop: "Cotton (Desi)", sownAcres: 14000, expectedYieldQuintals: 84000 },
    ],
    marketDemandQuintals: 215000,
    projectedSupplyQuintals: 210000,
    surplusDeficitQuintals: -5000,
    status: "Balanced Grid",
    solarGodownsAvailable: 6,
    godownCapacityQuintals: 36000,
    godownUtilizationPercent: 71,
    recommendedAction: "Grid supply balanced within ±2.5%. Lock in 100% of chilli harvest on ONDC forward contracts for Hyderabad HoReCa buyers.",
  },
];
