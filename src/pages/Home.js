import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonButton,
  IonInput,
  IonCard,
  IonText,
} from "@ionic/react";
import productDataDB from "./data.json";
import GamerCardNumber from "./GamousPoitsCard.json";

import { useEffect, useState } from "react";

const Home = () => {
  const [productData, setProductData] = useState(productDataDB);
  const [cardNumber, setCardNumber] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);
  const [errorCheck, setErrorCheck] = useState("false");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsgForCardNumber, setErrorMsgForCardNumber] = useState("");
  const [cardFound, setCardFound] = useState(false);

  const [discountApplied, setDiscountApplied] = useState(50);

  const QuantityChange = (prop) => {
    const [quantity, setQuantity] = useState(0);
    const [totalUnitPrice, setTotalUnitPrice] = useState(0);

    useEffect(() => {
      setTotalUnitPrice(quantity * prop.unitPrice);
    }, [quantity, productData]);
    return (
      <>
        <IonCol className="ion-align-self-center">
          <div className="photo">
            {prop.quantityItem < 1 ? (
              <img src="https://image.shutterstock.com/image-vector/sold-out-red-grunge-stamp-260nw-1456885082.jpg" />
            ) : (
              <img src={prop.image} />
            )}
          </div>
        </IonCol>
        <IonCol className="ion-align-self-center">
          {prop.itemDescription}
        </IonCol>

        <IonCol className="ion-align-self-center">
          <IonButton
            className="add-btn"
            size="small"
            disabled={
              prop.quantityItem < 1 || quantity === 0 ? "true" : "false"
            }
            onClick={() => {
              quantity <= 0 ? setQuantity(quantity) : setQuantity(quantity - 1);
            }}
          >
            -
          </IonButton>
          <IonText
            disabled={prop.quantityItem < 1 ? "true" : "false"}
            id={"q" + (prop.id - 1)}
            value={quantity}
            type="number"
            onIonChange={(e) => setQuantity(parseInt(e.detail.value))}
          >
            {quantity}
          </IonText>
          <IonButton
            disabled={
              prop.quantityItem < 1 || quantity === prop.quantityItem
                ? "true"
                : "false"
            }
            max={prop.quantityItem}
            size="small"
            className="add-btn"
            onClick={() => {
              quantity < prop.quantityItem
                ? setQuantity(quantity + 1)
                : setQuantity(quantity);
            }}
          >
            +
          </IonButton>
        </IonCol>
        <IonCol className="ion-align-self-center">R{prop.unitPrice}</IonCol>
        <IonCol
          id={prop.id - 1}
          value={totalUnitPrice}
          className="ion-align-self-center"
        >
          R{totalUnitPrice}
        </IonCol>
      </>
    );
  };

  const CheckOutHandler = () => {
    setErrorCheck("false");
    setErrorMsg("");
    const tempNewDataEntry = productData;
    for (var i = 0; i < productData.length; i++) {
      if (
        tempNewDataEntry[i].quantity - document.getElementById("q" + i).value <
        0
      ) {
        setErrorCheck("true");
        setErrorMsg(
          "Error: Max quantity for " +
            tempNewDataEntry[i].itemDescription +
            " is " +
            tempNewDataEntry[i].quantity
        );
        return;
      } else if (
        tempNewDataEntry[i].quantity - document.getElementById("q" + i).value >=
        0
      ) {
        tempNewDataEntry[i].quantity -= document.getElementById("q" + i).value;
      } else {
        setErrorCheck("true");
        setErrorMsg("Error: Incorrect Quantity Entry");
      }
    }

    if (errorCheck != "true") {
      setProductData(tempNewDataEntry);
      setTotalPrice(
        document.getElementById(0).value +
          document.getElementById(1).value +
          document.getElementById(2).value +
          document.getElementById(3).value +
          document.getElementById(4).value
      );
    }
  };

  const CardCheckHandler = () => {
    setErrorMsgForCardNumber("");

    if (cardNumber.length === 6) {
      setErrorMsgForCardNumber("Error: Card does not exist");

      for (var i = 0; i < GamerCardNumber.length; i++) {
        if (cardNumber === "123456") {
          setDiscountApplied(60);
          setCardFound(true);
          setErrorMsgForCardNumber("");
        }
      }
    } else {
      setErrorMsgForCardNumber("Error: 6 digits are required");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Check Out</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen style={{ textAlign: "center" }}>
        <IonTitle style={{ align: "center" }}>
          Current Discount {discountApplied}%
        </IonTitle>

        <IonCard>
          <IonLabel>
            <b> GAMEOUS POINTS CARD</b> for 60% off?
          </IonLabel>
          {discountApplied == 50 ? (
            <div>
              <IonInput
                placeholder="Enter Card Number"
                onIonChange={(event) => setCardNumber(event.detail.value)}
              ></IonInput>
              <IonButton onClick={() => CardCheckHandler()}>Apply</IonButton>
              <IonLabel size={{ fontSize: "small" }}>
                For tutors cardNumber is <b>123456</b>
              </IonLabel>
            </div>
          ) : (
            <div>
              <IonInput disabled="true" value="******"></IonInput>
              <IonButton color="success" disabled="true">
                Applied
              </IonButton>
            </div>
          )}
          {discountApplied === 50 ? (
            <IonLabel color="danger">{errorMsgForCardNumber}</IonLabel>
          ) : (
            <></>
          )}
        </IonCard>

        <IonGrid>
          <IonRow>
            <IonCol></IonCol>
            <IonCol>Item Description</IonCol>
            <IonCol>Quantity</IonCol>
            <IonCol>Unit Price</IonCol>
            <IonCol>Total Price</IonCol>
          </IonRow>

          {productData.map((item) => (
            <IonRow key={item.id} className="ion-justify-content-center">
              <QuantityChange
                unitPrice={item.unitPrice}
                id={item.id}
                itemDescription={item.itemDescription}
                image={item.image}
                quantityItem={item.quantity}
              />
            </IonRow>
          ))}
          {errorMsg.length > 0 ? (
            <IonRow className="ion-text-center">
              <IonCol>
                <IonButton color="danger" style={{ fontSize: "10px" }}>
                  {errorMsg}
                </IonButton>
              </IonCol>
            </IonRow>
          ) : (
            <>
              {totalPrice > 0 ? (
                <div style={{ border: "1px solid blue" }}>
                  <IonRow>
                    <IonCol className="ion-text-center">
                      <IonButton color="success" disabled="true">
                        Success
                      </IonButton>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol className="ion-text-center">
                      <IonText>Price</IonText>
                    </IonCol>
                    <IonCol className="ion-text-center">
                      <IonText>R{totalPrice}</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol className="ion-text-center">
                      <IonText>Discount</IonText>
                    </IonCol>
                    <IonCol className="ion-text-center">
                      <IonText>{discountApplied}%</IonText>
                    </IonCol>
                  </IonRow>
                  <div style={{ border: "1px solid blue" }}>
                    <IonRow>
                      <IonCol className="ion-text-center">
                        <b>
                          <IonText>Total</IonText>
                        </b>
                      </IonCol>
                      <IonCol className="ion-text-center">
                        <IonText>
                          <b>R{(totalPrice * discountApplied) / 100}</b>
                        </IonText>
                      </IonCol>
                    </IonRow>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          )}

          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton onClick={() => CheckOutHandler()}>CheckOut</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
