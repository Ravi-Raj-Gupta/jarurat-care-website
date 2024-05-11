import { type ChatGraph } from '../graph';

const types: ChatGraph = {
	content:
		'गैलब्लैडर कैंसर के छह विभिन्न प्रकार हैं। कृपया और अधिक जानने के लिए एक प्रकार का चयन करें।',
	options: [
		{
			content: 'एडेनोकार्सिनोमा',
			nextNode: {
				content:
					'यह सबसे सामान्य प्रकार का गैलब्लैडर कैंसर है, जो सभी मामलों का लगभग 90% बनाता है। एडेनोकार्सिनोमा गैलब्लैडर के अंदर की भीतरी दीवार की जलवायु को लाइनिंग करने वाले ग्रंथीय कोशिकाओं में शुरू होता है।',
				options: []
			}
		},
		{
			content: 'पैपिलरी एडेनोकार्सिनोमा',
			nextNode: {
				content:
					'एडेनोकार्सिनोमा का एक उपप्रकार, यह प्रकार लिवर या लसिका ग्रंथियों में इतनी तेजी से फैलाने की प्रवृत्ति नहीं होती है, जिससे अन्य प्रकार के गैलब्लैडर कैंसर के तुलनात्मक भविष्यावाणी हो सकती है।',
				options: []
			}
		},
		{
			content: 'स्क्वेमस सेल कैंसर',
			nextNode: {
				content:
					'ये कैंसर स्क्वेमस कोशिकाओं में शुरू होते हैं, जो फ्लैट, त्वचा जैसी कोशिकाओं को लाइन कर सकते हैं जो गैलब्लैडर के कुछ हिस्सों को लाइन कर सकते हैं।',
				options: []
			}
		},
		{
			content: 'एडेनोस्क्वेमस कार्सिनोमा',
			nextNode: {
				content: 'इस प्रकार में ग्रंथीय और स्क्वेमस सेल विशेषताओं दोनों होती हैं।',
				options: []
			}
		},
		{
			content: 'स्मॉल सेल कैंसर',
			nextNode: {
				content: 'एक कम सामान्य प्रकार जो अधिक तेजी से बढ़ता है और फैलता है।',
				options: []
			}
		},
		{
			content: 'सार्कोमा',
			nextNode: {
				content: 'गैलब्लैडर की मांसपेशी या कनेक्टिव ऊतक में उत्पन्न होता है।',
				options: []
			}
		}
	]
};

const stages: ChatGraph = {
	content: 'आप किस चरण के गैलब्लैडर कैंसर के बारे में जानना चाहेंगे?',
	options: [
		{
			content: 'स्थिति 0',
			nextNode: {
				content:
					'कार्सिनोमा स्थान में। इस चरण में, गैलब्लैडर की अंदर की सबसे अंतिम परत में असामान्य कोशिकाएँ पाई जाती हैं, लेकिन वे फैली नहीं हैं। यह चरण विशेषत: इस चरण में शायद वे नहीं डायग्नोस किया जाता हैं।',
				options: []
			}
		},
		{
			content: 'स्थिति I',
			nextNode: {
				content: `कैंसर गैलब्लैडर की दीवार की भीतरी परतों में मौजूद है। चरण I को इस प्रकार से विभाजित किया जाता है:
- IA (केवल अंतिम परतों तक सीमित)
- IB (अगले परत में फैल गया है)।`,
				options: []
			}
		},
		{
			content: 'स्थिति II',
			nextNode: {
				content:
					'कैंसर मांसपेशियों के परत से निकल गया है और संभावना है कि गैलब्लैडर के बाहरी परत में भी फैल गया है, लेकिन निकट स्थानों या लसिका ग्रंथियों में फैलने नहीं।',
				options: []
			}
		},
		{
			content: 'स्थिति III',
			nextNode: {
				content: `इस चरण को इस प्रकार से विभाजित किया गया है:
- IIIA (कैंसर बाहरी परत से निकल गया है और आसपास के अंग या संरचनाओं में फैल गया है)
- IIIB (कैंसर निकट स्थानों के लसिका ग्रंथियों में फैल गया है, लेकिन दूरस्थ स्थानों में नहीं)।`,
				options: []
			}
		},
		{
			content: 'स्थिति IV',
			nextNode: {
				content: `गैलब्लैडर कैंसर का सबसे आगे का चरण, इसका संकेत है कि कैंसर दूरस्थ अंगों या ऊतकों में फैल गया है। चरण IV को इस प्रकार से विभाजित किया गया है:
- IVA (मुख्य रक्तसंचार और गैलब्लैडर के पास के अंगों में फैल गया है)
- IVB (दूरस्थ अंगों या लसिका ग्रंथियों में फैल गया है)।`,
				options: []
			}
		}
	]
};

const tests: ChatGraph = {
	content: 'मैंने कुछ टेस्ट गैलब्लैडर कैंसर से संबंधित पाए हैं। क्या आप कृपया एक का चयन करें?',
	options: [
		{
			content: 'रक्त परीक्षण',
			nextNode: {
				content: `#### रक्त परीक्षण
- लिवर कार्य परीक्षण (LFTs): ALT, AST, बिलीरुबिन, और एल्ब्यूमिन जैसे एंजाइम और प्रोटीन के स्तर की जांच करता है। असामान्य स्तर लिवर समस्याओं का संकेत दे सकते हैं।
- अल्फा-फीटोप्रोटीन (AFP) परीक्षण: उच्च AFP स्तर अक्सर लिवर कैंसर की ओर इशारा करते हैं, विशेषत: हेपेटोसेल्युलर कार्सिनोमा (HCC)।
- पूरा रक्त गणना (CBC): अनीमिया, संक्रमण, और अन्य रक्त संबंधी समस्याओं की पहचान के लिए महत्वपूर्ण है।
- रक्तजनन परीक्षण (PT जैसे): लिवर की क्लॉटिंग क्षमता का मूल्यांकन करता है।
- किडनी कार्य परीक्षण: लिवर रोग और उपचार किडनी स्वास्थ्य पर प्रभाव डाल सकते हैं।`,
				options: []
			}
		},
		{
			content: 'इमेजिंग परीक्षण',
			nextNode: {
				content: `#### इमेजिंग परीक्षण - एक नजदीकी झलक

- अल्ट्रासाउंड: पहले लिवर कैंसर स्क्रीनिंग के लिए जानकारी है; लिवर में परिवर्तनों को ध्यान से देखने और बायोप्सी के मार्गदर्शन के लिए महान है।
- सीटी स्कैन: विस्तृत लिवर छवियों की पेशकश, ट्यूमर के आकार, संख्या, और स्थान को समझने के लिए महत्वपूर्ण है, और सर्जिकल नियोजन के लिए।
- MRI: सॉफ्ट टिश्यू विविधता में टॉप, भिन्न और केवलर लिवर गांठियों के बीच का भेदन, और सर्जिकल निर्णयों में मदद करने के लिए महत्वपूर्ण है।
- PET स्कैन: अक्सर एक सीटी स्कैन के साथ जोड़ा जाता है, यह सक्रिय कैंसर कोशिकाओं को खोजने में महत्वपूर्ण है और कैंसर फैलाव की जाँच करता है।
- कन्ट्रास्ट-एनहांस्ड अल्ट्रासाउंड (CEUS): लाइवर लीजन का विशेषता करने में मानक अल्ट्रासाउंड की प्रभावकारिता को बढ़ाता है।
- एंजियोग्राफी: लिवर की रक्त संचारित नसों को नक्शा बनाने के लिए अमूल्य है, विशेषत: टीएसईसी जैसे कुछ उपचारों के नियोजन में।
- लिवर इलास्टोग्राफी: बिना आघातक रूप से लिवर फाइब्रोसिस और सिरोसिस की जोखिम को मापता है।
- बोन स्कैन: अगर हड्डियों के मेटास्टासिस की संदेह हो तो प्रयुक्त होता है।`,
				options: []
			}
		},
		{
			content: 'बायोप्सी तकनीकें',
			nextNode: {
				content: `#### बायोप्सी तकनीकें - निदान की पुष्टि

- परकटेनियस नीडल बायोप्सी: कम आक्रामक, अक्सर पहली पसंद; विश्लेषण के लिए ऊतक प्राप्त करता है।
- फाइन नीडल एस्पिरेशन (FNA): कम आक्रामक, अलग लेशन प्रकारों का विभाजन करने के लिए अच्छा है।
- कोर नीडल बायोप्सी: विस्तृत विश्लेषण के लिए एक समग्र ऊतक प्राप्त करता है।
- लैपरोस्कोपिक बायोप्सी: कठिन-से-कठिन लेशन के लिए उपयुक्त लिवर और ट्यूमर दृश्यता प्रदान करता है।
- ट्रांसजुगुलर बायोप्सी: रक्तस्राव के जोखिम वाले रोगियों के लिए आदर्श है।
- सर्जिकल बायोप्सी: विशेषत: ट्यूमर हटाने के दौरान विश्लेषण के लिए एक पर्याप्त ऊतक प्राप्त करता है।
- छवि-मार्गदर्शित बायोप्सी: ट्यूमर को लक्षित करने में सटीकता को बढ़ाता है।`,
				options: []
			}
		},
		{
			content: 'आनुवांशिक और आणविक परीक्षण',
			nextNode: {
				options: [],
				content: `आनुवांशिक और आणविक परीक्षण - उपचार को अनुकूलित करना

- अगली पीढ़ी की क्रमश: एक व्यापक जीनोमिक विश्लेषण, टारगेटेड थेरेपी निर्णयों में सहायक है।
- PCR, FISH, और IHC: ये परीक्षण विशिष्ट म्यूटेशन, क्रोमोसोमीयल असमानताओं, और ट्यूमर कोशिकाओं में प्रोटीन का पता लगाते हैं।
- सर्कुलेटिंग ट्यूमर डीएनए (सीटीडीएनए) परीक्षण: ट्यूमर जीनेटिक्स में एक बिना आघातक झलक प्रदान करता है।
- जीन अभिव्यक्ति और माइक्रोआरएन प्रोफाइलिंग: लिवर कैंसर उपप्रकारों और संभावित बायोमार्कर्स पर प्रकाश डालता है।
- प्रोटीओमिक विश्लेषण और फार्माकोजेनोमिक्स: औषधीय लक्ष्यों की पहचान करता है और औषधियों की प्रतिक्रिया की पूर्वानुमानित करता है।`
			}
		},
		{
			content: 'अतिरिक्त निदान प्रक्रियाएँ',
			nextNode: {
				options: [],
				content: `#### अतिरिक्त निदान प्रक्रियाएँ

- एंडोस्कोपिक परीक्षण (ईआरसीपी, ईयूएस): बायल डक्ट के ट्यूमर्स और बायोप्सी मार्गदर्शन के लिए उपयोगी हैं।
- लिवर एंजियोग्राफी और लैपरोस्कोपी: लिवर और रक्त सप्लाई की स्पष्ट छवियों को प्रदान करते हैं।
- पल्मोनरी और हृदय मूल्यांकन: सर्जरी के लिए फिटनेस का मूल्यांकन करता है।
- स्टेजिंग परीक्षण: कैंसर के व्याप्ति और फैलाव को मापने के लिए विभिन्न परीक्षणों को संयोजित करता है।
- अन्य परीक्षण (छाती का एक्स-रे, हड्डी स्कैन, इत्यादि): मेटास्टेसिस के लिए जांच करें और रोगी की कुल स्वास्थ्य की जांच करें।
				`
			}
		}
	]
};

const treatments: ChatGraph = {
	content:
		'यहां भारत में उपलब्ध सबसे सामान्य उपचार विकल्पों की एक सूची है। कृपया अधिक जानने के लिए एक विकल्प चुनें।',
	options: [
		{
			content: 'स्थिति I और II',
			nextNode: {
				content: `
1. सर्जिकल विकल्प:
	- **पुनर्शोधन**: इसमें लिवर का हिस्सा कैंसर के साथ हटा जाता है। यह वे रोगी लिवर के सुचारू विकास के साथ लिवर कैंसर के लिए सबसे प्रभावी है जिनकी अच्छी लिवर कार्य प्रतिदिन है।
	- **लिवर प्रत्यारोपण**: इसमें रोगी के साथ स्वस्थ एक और बदला हुआ लिवर के साथ बदल दिया जाता है। यह विशेष रूप से लिवर कैंसर के कुछ प्रकार के पहले चरणों में फायदेमंद है, विशेषत: उन रोगियों के लिए जो सिरोसिस जैसे लिवर रोगों से पीड़ित हैं।

2. स्थानीय उपचार:
	- **रेडियोफ्रीक्वेंसी एब्लेशन (आरएफए)**: यह तकनीक बिजली की धाराओं का उत्पन्न होना पर्याप्त है और कैंसर को क्षति पहुंचाता है।
	- माइक्रोवेव एब्लेशन: आरएफए के समान है, लेकिन कैंसर को माइक्रोवेव से गरम करके मार देता है।
	- **क्रायोएब्लेशन**: कैंसर को फ्रीज करता है और ध्वनि करता है।
	- एम्बोलिजेशन थेरेपी: इनमें ट्रांसार्टीअरियल केमोएंबोलिजेशन (टीएसईसी) और ट्रांसार्टियल रेडिओएम्बोलिजेशन (टारे या वाई 90) जैसी विधियाँ शामिल हैं, जो ट्यूमर की रक्त सप्लाई को काट देती हैं। वे शायद ही ट्यूमर को इसके साथ केमोथेरेपी या रेडियोएक्टिव कणों को सीधे ट्यूमर में पहुंचा सकते हैं।
				
3. रेडिएशन थेरेपी:
	- **बाहरी बीम रेडिएशन**: बाहरी बॉडी का उपयोग करके रेडिएशन का लक्ष्य करता है।
	- **स्टेरियोटैक्टिक बॉडी रेडिएशन थेरेपी (एसबीआरटी)**: एक ठीक, उच्च डोज रेडिएशन उपचार।`,
				options: []
			}
		},
		{
			content: 'स्थिति III(A, B, C) और IV',
			nextNode: {
				content: `
1. प्रणालीक उपचार:

	- **केमोथेरेपी**: उपचार के लिए दवाओं का उपयोग करती है या कैंसर कोशिकाओं की वृद्धि या रुकावट को ठहराती है। यह अक्सर लिवर से बाहर फैल जाने पर जाने वाला विकल्प है।
	- **लक्षित थेरेपी**: ये दवाएँ विशेष रूप से कैंसर कोशिकाओं के विकास और फैलाव की क्षमता को आक्रमण करती हैं। एक उदाहरण है सोराफेनिब, लिवर कैंसर के उपचार में सामान्य रूप से उपयोग किया जाता है। 
	- **इम्यूनोथेरेपी**: ये दवाएँ कैंसर से लड़ने की शक्ति को बढ़ाने के लिए जीनियों को उत्पन्न करती हैं, जैसे कि निवोल्यूमैब और पेम्ब्रोलीजुमैब की जाँच करते समय केकपॉइंट इन्हिबिटर्स।

2. सहायक देखभाल:

	- **दर्द प्रबंधन**: दर्द को कम करने और जीवन की गुणवत्ता को बढ़ाने के लिए दवाओं और अन्य तकनीकों का उपयोग करता है।
	- पोषण सहायता: एक डाइट योजना पर ध्यान केंद्रित करता है जो शक्ति और ऊर्जा को बनाए रखने में मदद करती है।
	- **मनोवैज्ञानिक सहायता**: सलाहकार या समर्थन समूह के माध्यम से मानसिक स्वास्थ्य की देखभाल प्रदान करता है।

3. वैज्ञानिक प्रयोग:

	- नए, प्रयोगात्मक उपचारों तक पहुँचने के लिए रोगियों को वैज्ञानिक प्रयोगों में भाग लेने का विचार किया जा सकता है [यहाँ](https://clinicaltrials.gov/)`,
				options: []
			}
		}
	]
};

const emergencyMedications: ChatGraph = {
	content: `
#### केमोथेरेपी के दौरान सामान्य साइड इफेक्ट्स के लिए आपातकालीन दवाएँ

<div style="background: #fef9c3; padding: 1rem; border-radius: 0.5rem">कृपया ध्यान दें कि यह पेशेवर सलाह का विकल्प नहीं है - ये दवाएँ सुझाई गई प्राथमिक चिकित्सक के द्वारा उपचार की निगरानी करते समय चिकित्सा सेवाओं के पहुंचने तक की पहली सहायता के रूप में सूचीबद्ध की गई हैं। संकेतित मात्रा 60 किग्रा के औसत वजन पर आधारित है और आपको अपने वजन / आयु / लक्षणों के आधार पर विभिन्न मात्रा की आवश्यकता हो सकती है।</div>

**मतली/उलटी**
- टैब ओंडानसेट्रॉन 8 मिलीग्राम दिन में दो बार
- टैब मेटोक्लोप्रामाइड 10 मिलीग्राम दिन में तीन बार
- ऊपर दिए गए दवाओं को लेने में असमर्थता की स्थिति में, तब टैब डोम्पेरिडोन-एमडी जीभ के नीचे तीन बार दिन में

**दस्त**
- कैप लोपेरामाइड 2 मिलीग्राम हर 6 घंटे में
- प्रोबायोटिक दही भी मदद करता है

**बुखार/फ्लू जैसे लक्षण**
- टैब पैरासेटामोल 650 मिलीग्राम - प्रत्येक 6 घंटे में दोहराया जा सकता है
- अगर आपको केमोथेरेपी के दौरान बुखार (100.4 डिग्री फारेनहाइट से अधिक) है, तो यह संकेत हो सकता है कि संक्रमण है। यह सलाह दी जाती है कि इलाज करने वाले ऑन्कोलॉजिस्ट से संपर्क करें और तत्काल एंटीबायोटिक्स की आवश्यकता है या नहीं को निर्धारित करें।
 
**चकत्ते**
- टैब लेवोसेट्रिज़ीन 5 मिलीग्राम दिन में दो बार अगर खुजली हो
- लैक्टोकैलामाइन लोशन दिन में दो बार लगाना

**न्यूरोपैथी**
- टैब ड्यूलोक्सटीन 30 मिलीग्राम रात को एक बार

**कब्ज़**
- सिप स्लैक्टुलोज़ 20 मिलीलीटर रोज रात को

**मुंह के छाले**
- कोलीन सैलिसिलेट+बैंजाल्कोनियम क्लोराइड जेल
- बेंजीडामाइन माउथ वॉश दिन में तीन बार

**उच्च रक्तचाप**
- टैब एम्लोडिपीन 5 मिलीग्राम रोज एक बार

**नींद की समस्या**
- टैब जोल्पिडेम 5 मिलीग्राम रात को एक बार

**उच्च रक्त शर्करा**
- डॉक्टर से परामर्श करें

**चेहरे/हाथों/पैरों में सूजन**
- टैब फ्लुसीमाइड 10 मिलीग्राम दिन में दो बार
- उच्च प्रोटीन आहार
`,
	options: []
};

const activeSymptoms: ChatGraph = {
	content: 'कृपया निम्नलिखित लक्षणों में से जो आपको अनुभव हो रहे हैं, उन्हें चुनें:',
	options: [
		{
			content: 'रोग संबंधित',
			nextNode: {
				content: `
1. **Jaundice**: Yellowing of the skin and eyes, often one of the most noticeable signs, indicating bile duct obstruction. Signs include dark urine, pale stools, and itching.
2. **Abdominal Pain**: Pain or discomfort, particularly in the upper right abdomen. May radiate to the back or shoulder.
3. **Bloating or Abdominal Swelling**: Could indicate fluid accumulation (ascites) or tumour growth. The abdomen may feel tight or distended.
4. **Fever or Chills**: Can suggest an infection, such as cholangitis, especially if bile ducts are blocked. High temperature and shaking might occur.
5. **Itching (Pruritus)**: Due to the buildup of bile salts in the skin. Skin may appear red or irritated.
6. **Changes in Stool**: Pale, greasy, or clay-colored stools. Indicates a lack of bile in the intestines.
7. **Weight Loss and Appetite Loss**: Unintended weight loss without trying. May feel full quickly or have no desire to eat.
8. **Fatigue**: Persistent tiredness not relieved by rest.
9. **Sepsis**: Sepsis is a serious complication of an infection that can be triggered by cancer-related infections or as a side effect of chemotherapy, which can weaken the immune system. It’s vital to recognise the signs early:

- High fever or very low body temperature: A significant change in body temperature is often an early sign of sepsis.
- Increased heart rate: A heart rate higher than 90 beats per minute.
- Rapid breathing: A respiratory rate higher than 20 breaths per minute.
- Possible confusion or disorientation: Sepsis can affect mental status, leading to changes in alertness or confusion.
- Extreme pain or discomfort: Often described as the worst pain ever experienced.
- Edema or swelling: Due to fluid imbalance and systemic response to infection.
- Pale or discolored skin: May appear as a sign of poor circulation.
- Low urine output: A sign that the kidneys may not be functioning properly due to sepsis.
				`,
				options: []
			}
		},
		{
			content: 'केमोथेरेपी संबंधित',
			nextNode: {
				content: `
Please use medicine prescribed as per your oncologist for immediate first aid.

1. **Nausea and Vomiting**: Reaction to the drugs used in chemotherapy. May occur hours to days after treatment.
2. **Mucositis**: Inflammation and soreness in the mouth, throat, or esophagus. Signs include redness, swelling, or ulcers in the mouth.
3. **Diarrhea**: Chemotherapy can disrupt the lining of the intestine. Frequent, loose, or watery stools.
4. **Peripheral Neuropathy**: Damage to the peripheral nerves causing weakness, numbness, or pain in the hands and feet. Tingling or burning sensation, sensitivity to temperature or touch.
5. **Hair Loss (Alopecia)**: Some chemotherapy drugs can cause hair to thin or fall out. Can affect the scalp, eyebrows, eyelashes, and body hair.
6. **Low Blood Cell Counts**: Chemotherapy can affect the bone marrow’s ability to produce blood cells.
7. **Anemia (low red blood cells)**: Fatigue, dizziness.
8. **Neutropenia (low white blood cells)**: Increased risk of infection.
9. **Thrombocytopenia (low platelets)**: Easy bruising, bleeding.
10. **Skin and Nail Changes**: Changes in skin color, dry skin, rashes, or nail discoloration. Nails may become brittle or develop lines.
				`,
				options: []
			}
		}
	]
};

const dietCharts: ChatGraph = {
	content: 'कृपया अपने स्थान के आधार पर उपयुक्त आहार-चार्ट का चयन करें: ',
	options: [
		{ content: `<a href="/pdfs/diet-charts/assam.pdf" target="_blank">অসম</a>` },
		{ content: `<a href="/pdfs/diet-charts/bihar.pdf" target="_blank">बिहार</a>` },
		{ content: `<a href="/pdfs/diet-charts/chattisgarh.pdf" target="_blank">छत्तीसगढ़</a>` },
		{ content: `<a href="/pdfs/diet-charts/delhi.pdf" target="_blank">दिल्ली</a>` },
		{ content: `<a href="/pdfs/diet-charts/kashmir.pdf" target="_blank">कश्मीर</a>` },
		{ content: `<a href="/pdfs/diet-charts/punjab.pdf" target="_blank">पंजाब</a>` },
		{ content: `<a href="/pdfs/diet-charts/uttar-pradesh.pdf" target="_blank">उत्तर प्रदेश</a>` },
		{ content: `<a href="/pdfs/diet-charts/uttarakhand.pdf" target="_blank">उत्तराखण्ड</a>` },
		{ content: `<a href="mailto:jaruratcare@gmail.com?subject=Request%20diet-chart%20for%20[state%20name]" target="_blank">मेरा राज्य सूची में नहीं है</a>` },
	]
}


export const gallbladderHn: ChatGraph = {
	content: 'गैलब्लैडर कैंसर के बारे में आपको क्या जानना चाहिए?',
	options: [
		{ content: 'प्रकार', nextNode: types },
		{ content: 'चरण', nextNode: stages },
		{ content: 'चिकित्सा परीक्षण', nextNode: tests },
		{ content: 'उपचार विकल्प (भारत में)', nextNode: treatments },
		{ content: 'आपातकालीन दवाएँ', nextNode: emergencyMedications },
		{ content: 'सक्रिय लक्षण', nextNode: activeSymptoms },
		{ content: 'आहार-चार्ट', nextNode: dietCharts },
		{ content: '<a href="/pdfs/emotional-wellbeing-for-caregivers-hindi.pdf" target="_blank">भावनात्मक स्वास्थ्य</a>' }
	]
};
