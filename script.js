const lookup = [];

// set global variables
let userHours = 0;
let numberOfCOLAs = 0;
let numberOfSteps = 0;
let endHourlyRate = 0;
let payIncreaseDollar = 0;
let payIncreasePercent = 0;
let lifeOfContractTotal = 0;
let userLangCode = "en";

// translation object
const trans = {
  p1_1: {
    en: "You will be eligible for ",
    es: "Usted será elegible para ",
    ru: "Вы будете иметь право на ",
    vi: "Bạn sẽ đủ điều kiện nhận ",
    zh: "合同结束时，您将有资格获得 "
  },
  p1_2: {
    en: " COLAs (Cost of Living Adjustments) and up to ",
    es: " ajustes por costo de vida (COLA, siglas en inglés) a su salario y hasta ",
    ru: " COLA (корректировки стоимости жизни) и до ",
    vi: " COLA (Điều chỉnh chi phí sinh hoạt) và tăng lên tới ", 
    zh: " COLA（生活费用调整）和直到 "
  },
  p1_3: {
    en: " step increases by the end of the contract.",
    es: " aumentos por escalafón al vencimiento del contrato colectivo.",
    ru: " поступенчатых повышений зарплаты к концу действия контракта. ",
    vi: " bậc khi kết thúc hợp đồng.", 
    zh: " 步加薪。"
  },
  p2_1: {
    en: "Your hourly rate by the end of the 2023-2025 contract will be ",
    es: "Su pago por hora al final del contrato 2023-2025 será ",
    ru: "Ваша почасовая ставка к концу контракта на 2023-2025 годы составит ",
    vi: "Mức lương theo giờ của bạn vào cuối hợp đồng 2023-2025 sẽ là ", 
    zh: "到 2023-2025 年合同结束时，您的时薪将为 "
  },
  p3_1: {
    en: "This pay increase is ",
    es: "Este aumento salarial es ",
    ru: "Это увеличение заработной платы на ",
    vi: "Mức tăng lương này là ",
    zh: "此次加薪比当前 17.77 美元的基本工资高 "
  },
  p3_2: {
    en: " more per hour than the current base rate of $17.77. This is a ",
    es: " más por hora que la tarifa base actual de $17.77. Este es un aumento del ",
    ru: " больше в час, чем текущая базовая ставка в размере 17,77 долл. Это ",
    vi: " nhiều hơn mỗi giờ so với mức lương cơ bản hiện tại là 17,77 USD. Đây là mức tăng ",
    zh: " 倍。到合同结束时，每小时增加 "
  },
  p3_3: {
    en: " percent increase per hour by the end of the contract.",
    es: " por ciento por hora al vencimiento del contrato colectivo.",
    ru: "-процентное увеличение в час к концу действия контракта.",
    vi: " phần trăm mỗi giờ vào cuối hợp đồng.",
    zh: "%。"
  },
  p4_1: {
    en: "Your increase in earnings over the life of the contract is estimated to be ",
    es: "Su aumento estimado en los ingresos durante el plazo del acuerdo de negociación colectiva: ",
    ru: "Ваше увеличение заработка в течение срока действия контракта оценивается в ",
    vi: "Mức tăng thu nhập của bạn trong suốt thời hạn hợp đồng được ước tính là ",
    zh: "在合同期内，您的收入预计将增加 "
  },
}

document.addEventListener("DOMContentLoaded", function(){

  // save elements to variables for later access
  let displayEl = document.getElementById("display");
  let dispwrap = document.getElementById("dispwrap");
  let submit = document.getElementById("submitButton");
  let startOver = document.getElementById("startOverButton");
  let results = document.getElementById("results");
  let message = document.getElementById('message');
  let hpwEl = document.getElementById("hPW");
  let hpwCustom = document.getElementById("hPWCustom");
  let instructions = document.getElementById("instructions");
  let inputs = document.getElementById("inputs");
  let languagePicker = document.getElementsByClassName('gt_selector')[0];

  // set language code
  if (languagePicker) {
    console.log(`languagePicker: ${languagePicker.value}`);
    userLang = languagePicker.value;
  } else {
    userLang = navigator.language || navigator.userLanguage; 
    console.log(`userLang: ${userLang}`);
  }

  let userLangCode = userLang.substring(0,2).toLowerCase();
  console.log(`userLangCode: ${userLangCode}`);

  const langCodeOptions = ['en', 'es', 'ru', 'vi', 'zh'];

  // default to english if user language is not supported
  if (!langCodeOptions.includes('userLangCode')) {
    userLangCode = "en";
    console.log(`userLangCode: ${userLangCode}`);
  };

  // generate list of hours options
  let hoursOptions = Array.from(Array(50).keys());
  console.log(hoursOptions);

  // load list of hoursOptions
  hpwEl.options.length = 1;
  hoursOptions.forEach(item => {
    hpwEl.options[hpwEl.options.length] = new Option(item, item)
  });  

  // listen for changes to hours worked
  function hoursChange(e) {
    userHours = e.target.value;
    console.log(`userHours: ${userHours}`);
  }

  // clean currency strings
  const clean = (str) => {
    if (typeof(str) == "number") {
      return str;
    } else {
      return parseFloat(str.replace(/[^0-9]/g, ""));
    }
  };

  // generate results string and message
  function resultsString() {
    // set variables
    userObj = lookupUserObject(userPosition, userStep);
    currentMonthlyBase = clean(userObj['Current monthly pay']);
    console.log(`currentMonthlyBase: ${currentMonthlyBase}`);
    projectedMonthlyBase2024 = clean(userObj['2024 monthly pay']);
    console.log(`projectedMonthlyBase2024: ${projectedMonthlyBase2024}`);
    const projectedMonthlyBase2025 = clean(userObj['2025 monthly pay']);
    console.log(`projectedMonthlyBase2025: ${projectedMonthlyBase2025}`);
    projectedMonthlyIncrease2024 = clean(userObj['2024 monthly difference (2024-current)']);
    console.log(`projectedMonthlyIncrease2024: ${projectedMonthlyIncrease2024}`);
    annualIncrease2025 = clean(userObj["Annual pay at monthly pay at end of contract"]) - clean(userObj["Annual pay at current monthly pay"]);
    console.log(`annualIncrease2025: ${annualIncrease2025}`);
    const monthlyIncrease2025 = clean(userObj['2025 monthly difference (2025 - current)']);
    console.log(`monthlyIncrease2025: ${monthlyIncrease2025}`);
    const percentRaise = (((projectedMonthlyBase2025 - currentMonthlyBase)/currentMonthlyBase) * 100).toFixed(2);
    console.log(percentRaise);

    return `<p style="max-width: 600px; margin: auto auto 20px auto;"><ul style="max-width: 600px; margin: auto;"><li style="margin-bottom:15px;">If you are ${userPositionWithArticle} on step ${userStep}, your current monthly base salary is <span class="purplebold">$${currentMonthlyBase.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>. 
    </li><li style="margin-bottom:15px;">Upon ratification, you will receive a one-time cost-of-living payment of <span class="purplebold">$1,500</span>, before taxes.
    </li><li style="margin-bottom:15px;">After the first COLA in December 2023 and any steps you qualify for, your monthly salary will increase to <span class="purplebold">$${projectedMonthlyBase2024.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> by July 2024. This is a pay increase of <span class="purplebold"> $${projectedMonthlyIncrease2024.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> per month. 
    </li><li style="margin-bottom:15px;">After the second COLA in January (or February) of 2025 and any steps you qualify for, your monthly salary will increase to <span class="purplebold">$${projectedMonthlyBase2025.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> by July 2025. This is a total pay increase of <span class="purplebold"> $${monthlyIncrease2025.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> per month, or <span class="purplebold">$${annualIncrease2025.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> per year <span class="purplebold">(${percentRaise}%)</span>.
    </li></ul>
    </p>`
  }

  // On reload, reload page
  function handleReload() {
    window.location.reload();
  }

  // On submit, hide instructions and display results
  function handleSubmit(e) {
    e.preventDefault();
    if (!userPosition || !userClassificationCode || userStep == 0) {
      submit.setAttribute("style", "display:none;");
      startOver.setAttribute("style", "display:block;");
      instructions.setAttribute("style", "height: 0; display:none;");
      inputs.setAttribute("style", "height: 0; display:none;");
      message.setAttribute("style", "display:block;");
      results.innerHTML = "Please select both your classification and your current step.";
      return;
    }
    submit.setAttribute("style", "display:none;");
    startOver.setAttribute("style", "display:block;");
    instructions.setAttribute("style", "height: 0; display:none;");
    inputs.setAttribute("style", "height: 0; display:none;");
    message.setAttribute("style", "display:block;");
    results.innerHTML = resultsString();
  }

  submit.addEventListener("click", handleSubmit);
  startOver.addEventListener("click", handleReload);

  // custom select styling

  let x, i, j, l, ll, selElmnt, a, b, c;
  /* Look for any elements with the class "custom-select": */
  x = document.getElementsByClassName("custom-select");
  l = x.length;

  function replaceSelect(selElmnt, customElmt, replace) {
    ll = selElmnt.length;

    if (replace) {
      /* For each element, create a new DIV that will act as the selected item: */
      a = document.createElement("DIV");
      a.setAttribute("class", `select-selected ${selElmnt.getAttribute('id')}`);
    } else {
      a = document.getElementsByClassName(`select-selected ${selElmnt.getAttribute('id')}`)[0];
    }
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    customElmt.appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    
    for (j = 1; j < ll; j++) {

      /* For each option in the original select element,
      create a new DIV that will act as an option item: */
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function(e) {
          /* When an item is clicked, update the original select box,
          and the selected item: */
          let y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          if (s.getAttribute('id') === 'classification') {
            classificationChange({ target: s });
          };
          
          if (s.getAttribute('id') ==='step') {
            stepChange({ target: s });
          };
          h.click();
      });
      b.appendChild(c);
    }
    customElmt.appendChild(b);
    a.addEventListener("click", function(e) {
      /* When the select box is clicked, close any other select boxes,
      and open/close the current select box: */
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }
  for (i = 0; i < l; i++) {
    let customElmt = x[i];
    selElmnt = customElmt.getElementsByTagName("select")[0];
    replaceSelect(selElmnt, customElmt, true);
  }

  function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    let x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }

  /* If the user clicks anywhere outside the select box,
  then close all select boxes: */
  document.addEventListener("click", closeAllSelect); 

});
