const generateBatchData = (batchYear, startId, existingCoders) => {
  return Array.from({ length: 58 }, (_, i) => {
    const id = `${batchYear}MCF1R${String(i + 1).padStart(2, "0")}`;
    const existingCoder = existingCoders.find((coder) => coder.id === id);

    return {
      id: id,
      name: existingCoder?.name || (existingCoder ? "" : id),
      userName: existingCoder?.userName || "",
      batch: startId === "22" ? "2025" : "2024",
      gender: existingCoder?.gender || "male",
    };
  });
};

// Existing coders for batch 2025
const existingCoders2025 = [
  {
    id: "22MCF1R03",
    name: "Aman Joshi",
    userName: "amanjoshi149",
    gender: "male",
  },
  { id: "22MCF1R11", name: "Anubhav", userName: "anubhavsri", gender: "male" },
  {
    id: "22MCF1R18",
    name: "Devesh Gupta",
    userName: "_Devesh_G",
    gender: "male",
  },
  {
    id: "22MCF1R21",
    name: "Jigyashu Suman",
    userName: "jigs_",
    gender: "male",
  },
  {
    id: "22MCF1R38",
    name: "Raghvendra C",
    userName: "raghu30",
    gender: "male",
  },
  {
    id: "22MCF1R40",
    name: "Ramavath Santhosh",
    userName: "santhoshwon",
    gender: "male",
  },
  { id: "22MCF1R42", name: "Rohan Rai", userName: "Rohan_Rai", gender: "male" },
];

// Existing coders for batch 2024
const existingCoders2024 = [
  {
    id: "21MCF1R04",
    name: "Amit Awasthi",
    userName: "Awasthya",
    gender: "male",
  },
  {
    id: "21MCF1R08",
    name: "Bhawana Patidar",
    userName: "ptdr_girl",
    gender: "female",
  },
  {
    id: "21MCF1R09",
    name: "Charu Kamra",
    userName: "kamra_ck25",
    gender: "female",
  },
  {
    id: "21MCF1R11",
    name: "Devashis Patel",
    userName: "devashish_ind",
    gender: "male",
  },
  {
    id: "21MCF1R13",
    name: "Gaurav Mawari",
    userName: "gauravmawari1807",
    gender: "male",
  },
  {
    id: "21MCF1R14",
    name: "Govind Patidar",
    userName: "GovindPatidar22",
    gender: "male",
  },
  {
    id: "21MCF1R17",
    name: "Jyoti Purnima Singh",
    userName: "JYOTI_PURNIMA__SINGH8",
    gender: "female",
  },
  { id: "21MCF1R25", name: "Mukul Malse", userName: "malseji", gender: "male" },
  {
    id: "21MCF1R27",
    name: "Neeraj Kumar",
    userName: "LegitCodes",
    gender: "male",
  },
  {
    id: "21MCF1R30",
    name: "Nikhil Saxena",
    userName: "nikhil-saxena",
    gender: "male",
  },
  {
    id: "21MCF1R33",
    name: "Pankaj Patidar",
    userName: "mr_bindass_pnkj",
    gender: "male",
  },
  {
    id: "21MCF1R34",
    name: "Pinky Mangla",
    userName: "pinkymangla45",
    gender: "female",
  },
  {
    id: "21MCF1R36",
    name: "Prakhar Verma",
    userName: "Psychic_Hunter",
    gender: "male",
  },
  {
    id: "21MCF1R37",
    name: "Pranshu Singh",
    userName: "pranshu0801",
    gender: "male",
  },
  {
    id: "21MCF1R39",
    name: "Prem Kumar Panka",
    userName: "PREM261999",
    gender: "male",
  },
  {
    id: "21MCF1R41",
    name: "Rahul Kumar",
    userName: "lightmate",
    gender: "male",
  },
  { id: "21MCF1R44", name: "Ravi Kumar", userName: "rkmc2133", gender: "male" },
  {
    id: "21MCF1R46",
    name: "Sachin Gupta",
    userName: "sachin_gupta2007",
    gender: "male",
  },
  {
    id: "21MCF1R47",
    name: "Sagar Gupta",
    userName: "sagargupta1610",
    gender: "male",
  },
  {
    id: "21MCF1R48",
    name: "Sandeep Nayak",
    userName: "sandeepkumarnayak",
    gender: "male",
  },
  {
    id: "21MCF1R52",
    name: "Shubham Patidar",
    userName: "ptdr_shubham",
    gender: "male",
  },
  {
    id: "21MCF1R53",
    name: "Sikandar Kumar",
    userName: "sikandarsahilkumar",
    gender: "male",
  },
  {
    id: "21MCF1R55",
    name: "Sudhanshu Tripathi",
    userName: "officialsiud",
    gender: "male",
  },
  {
    id: "21MCF1R56",
    name: "Suman Yadav",
    userName: "Suman_yadav",
    gender: "female",
  },
];

// Generate data for both batches
const leetCodersData = {
  leetCoders: [
    ...generateBatchData("22", "2025", existingCoders2025),
    ...generateBatchData("21", "2024", existingCoders2024),
  ],
};

export default leetCodersData;
