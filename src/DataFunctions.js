import { db } from "./Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const checkUserExists = async (userid, password) => {
  const userRef = collection(db, "users");
  const q = query(
    userRef,
    where("user_id", "==", userid),
    where("password", "==", password)
  );
  const querySnapshot = await getDocs(q);
  // console.log("query: ", querySnapshot);
  let userData;
  querySnapshot.forEach((doc) => {
    if (doc.data() != null) {
      userData = doc.data();
    }
  });
  return userData;
};

export const putUser = (user_id, name, password, identity) => {
  const userRef = doc(collection(db, "users"));
  const data = {
    user_id: user_id,
    name: name,
    password: password,
    identity: identity,
  };
  setDoc(userRef, data);
};

export const putOrganization = (org_id, org_name, org_details) => {
  const userRef = doc(collection(db, "organizations"));
  const data = {
    org_id: org_id,
    org_name: org_name,
    org_details: org_details,
  };
  setDoc(userRef, data);
};

export const putBeneficiary = (name, org_id, user_id) => {
  const userRef = doc(collection(db, "org_beneficiary"));
  const data = {
    name: name,
    org_id: org_id,
    status: "pending",
    user_id: user_id,
  };
  setDoc(userRef, data);
};

export const getBeneficiaryStatus = async () => {
  const userRef = collection(db, "org_beneficiary");
  const userid = localStorage.getItem("userid");
  const q = query(userRef, where("user_id", "==", userid));
  const querySnapshot = await getDocs(q);
  let data = [];
  querySnapshot.forEach((doc) => {
    if (doc.data() != null) {
      data.push(doc.data());
    }
  });
  console.log(data);
  return data;
};

export const updateBeneficiaryStatus = async (org_id, user_id, status) => {
  const userRef = collection(db, "org_beneficiary");
  const q = query(
    userRef,
    where("org_id", "==", org_id),
    where("user_id", "==", user_id)
  );
  console.log(status);
  const querySnapshot = await getDocs(q);
  console.log("query: ", querySnapshot);
  let key;
  let data;
  querySnapshot.forEach((doc) => {
    if (doc.data() != null) {
      console.log(doc._document.key.path.segments[6]);
      key = doc._document.key.path.segments[6];
      data = {
        name: doc.data().name,
        org_id: org_id,
        status: status,
        user_id: user_id,
      };
      console.log(data);
    }
  });
  const docRef = doc(db, "org_beneficiary", key);
  const setDocRes = await setDoc(docRef, data);
  console.log(setDocRes);
};

export const getUserList = async () => {
  let userList = [];
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    userList.push({
      name: doc.data().name,
      user_id: doc.data().user_id,
    });
    // console.log("This is the list => ", orgList);
  });
  return userList;
};

export const getOrgList = async () => {
  let orgList = [];
  const q = query(collection(db, "organizations"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    orgList.push({
      org_details: doc.data().org_details,
      org_id: doc.data().org_id,
      org_name: doc.data().org_name,
    });
    // console.log("This is the list => ", orgList);
  });
  return orgList;
};

export const getBenForOrg = async (org_id) => {
  let benList = [];
  const userRef = collection(db, "org_beneficiary");
  const q = query(userRef, where("org_id", "==", org_id));
  const querySnapshot = await getDocs(q);
  // console.log("query: ", querySnapshot);
  querySnapshot.forEach((doc) => {
    if (doc.data() != null) {
      const ben = {
        name: doc.data().name,
        org_id: doc.data().org_id,
        status: doc.data().status,
        user_id: doc.data().user_id,
      };
      benList.push(ben);
    }
  });
  //   console.log(benList);
  return benList;
};

export const putTransaction = (id, amount, from, to) => {
  const userRef = doc(collection(db, "transactions"));
  var currentdate = new Date();
  var datetime =
    currentdate.getMonth() +
    1 +
    "/" +
    currentdate.getDate() +
    "/" +
    currentdate.getFullYear() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  const data = {
    id: id,
    amount: amount,
    from: from,
    to: to,
    date: datetime,
  };
  setDoc(userRef, data);
};

export const getAllTransactionsForUser = async () => {
  let tranList = [];
  const userRef = collection(db, "transactions");
  const userid = localStorage.getItem("userid");
  let q = query(userRef, where("from", "==", userid));
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.data() != null) {
      const transaction = {
        id: doc.data().id,
        from: doc.data().from,
        to: doc.data().to,
        amount: doc.data().amount,
        date: doc.data().date,
      };
      tranList.push(transaction);
    }
  });
  q = query(userRef, where("to", "==", userid));
  querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.data() != null) {
      const transaction = {
        id: doc.data().id,
        from: doc.data().from,
        to: doc.data().to,
        amount: doc.data().amount,
        date: doc.data().date,
      };
      tranList.push(transaction);
    }
  });
  return tranList;
};

export const getAllTransactionsForOrg = async (orgAddress) => {
  let tranList = [];
  const userRef = collection(db, "transactions");
  let q = query(userRef, where("from", "==", orgAddress));
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (doc.data() != null) {
      const transaction = {
        id: doc.data().id,
        from: doc.data().from,
        to: doc.data().to,
        amount: doc.data().amount,
        date: doc.data().date,
      };
      tranList.push(transaction);
    }
  });
  // q = query(userRef, where("to", "==", orgAddress));
  // querySnapshot = await getDocs(q);
  // querySnapshot.forEach((doc) => {
  //   if (doc.data() != null) {
  //     const transaction = {
  //       id: doc.data().id,
  //       from: doc.data().from,
  //       to: doc.data().to,
  //       amount: doc.data().amount,
  //       date: doc.data().date,
  //     };
  //     tranList.push(transaction);
  //   }
  // });
  console.log(tranList);
  return tranList;
};
