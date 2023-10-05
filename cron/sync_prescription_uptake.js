
import cron from "node-cron"
import { poolPromise } from "../config/db.js";
import moment from "moment-timezone";

async function getAllPrescriptionUptake() {
  const query = "SELECT * FROM prescription_drug"

  const outputGetAll = await poolPromise.query(query)
  return outputGetAll[0]
}

async function addDrugUptakeCron(data, userId) {
  let query = "INSERT INTO prescription_drug_uptake (user_id, date, drug_name, quantity_mg, tablet, validation) VALUES(?,?, ?, ?, ?, 0)"
  console.log(data)

  const result = await poolPromise.query(query, [
    userId,
    data.date,
    data.drug_name,
    data.quantity_mg,
    data.tablet,
  ])

  console.log(result)
  return result
}

async function syncCronPrescriptionUptakes() {
  console.log('running a task every minute');
  const allDataPrecription = await getAllPrescriptionUptake()
  allDataPrecription.forEach((eachObj) => {
    eachObj.time.forEach((eachTime) => {
      const eachTimeUtc = moment.tz(eachTime, "HH:mm", "Europe/Paris")
      .utc()
      .format("HH:mm");
      eachTime = eachTimeUtc
    })
  })

  console.log(allDataPrecription)
  for (let i = 0; i < allDataPrecription.length; i++) {
    let today = new Date().toISOString().split("T")[0];

    for (let j = 0; j < allDataPrecription[i].time.length; j++) {
      let data_today = {
        drug_name: allDataPrecription[i].drug_name,
        quantity_mg: allDataPrecription[i].quantity_mg,
        tablet: allDataPrecription[i].tablet,
        date: `${today} ${allDataPrecription[i].time[j]}`,
      };
      try {
        await addDrugUptakeCron(data_today, allDataPrecription[i].user_id)
      } catch (error) {
       console.error(error) 
      }
    }
  }
  
}



cron.schedule('* * * * *', () => {
  syncCronPrescriptionUptakes()
});