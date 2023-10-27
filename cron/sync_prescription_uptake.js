
import cron from "node-cron"
import { poolPromise } from "../config/db.js";
import moment from "moment-timezone";

async function getAllPrescriptionUptake() {
  const query = "SELECT * FROM prescription_drug"

  const outputGetAll = await poolPromise.query(query)
  return outputGetAll[0]
}

async function addDrugUptakeCron(data, userId) {
  const query = `INSERT INTO prescription_drug_uptake (validation, drug_name, quantity_mg, tablet, date_uptake, created_at, Id_Prescription_drug, Id_Users) VALUES (0, ?, ?, ?, ?, ?, ?, ?)`
  console.log(data)
  const dateTimeToday = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

  const result = await poolPromise.query(query, [
    data.drug_name,
    data.quantity_mg,
    data.tablet,
    data.date,
    dateTimeToday,
    data.Id_Prescription_drug,
    userId,
  ])

  console.log(result)
  return result
}

async function syncCronPrescriptionUptakes() {
  console.log('running a task every minute');
  const allDataPrsecription = await getAllPrescriptionUptake()
  allDataPrsecription.forEach((eachObj) => {
    eachObj.time.forEach((eachTime) => {
      const eachTimeUtc = moment.tz(eachTime, "HH:mm", "Europe/Paris")
      .utc()
      .format("HH:mm");
      eachTime = eachTimeUtc
    })
  })

  console.log(allDataPrsecription)

  for (let i = 0; i < allDataPrsecription.length; i++) {
    let today = new Date().toISOString().split("T")[0];
    const dayDateEndTreatment = new Date(allDataPrsecription[i].date_end_treatement).getDate()

    for (let j = 0; j < allDataPrsecription[i].time.length; j++) {
      let data_today = {
        Id_Prescription_drug: allDataPrsecription[i].Id_Prescription_drug,
        drug_name: allDataPrsecription[i].drug_name,
        quantity_mg: allDataPrsecription[i].quantity_mg,
        tablet: allDataPrsecription[i].tablet,
        date: `${today} ${allDataPrsecription[i].time[j]}`,
      };
      try {
        if(new Date(today).getDate() < dayDateEndTreatment) {
          await addDrugUptakeCron(data_today, allDataPrsecription[i].Id_Users)
        }
      } catch (error) {
       console.error(error) 
      }
    }
  }
  
}

cron.schedule('0 3 * * *', syncCronPrescriptionUptakes, {
  scheduled: true,
  timezone: "Europe/Paris",
});