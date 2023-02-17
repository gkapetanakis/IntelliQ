# Software Engineering Project 2022-2023

#### __Group__
SoftEng2022-01
#### __Members__
* el19005 - Δημήτριος Γεωργούσης
* el19062 - Γεώργιος-Αλέξιος Καπετανάκης

## Description
The documentation was produced by Visual Paradigm, but uses custom XML
templates and a Fill-In Doc (Word Document with Doc fields that Visual
Paradigm will Fill-In with appropriate content), so we'll explain how to
recreate our SRS document in Visual Paradigm.

### Software requirements
* Visual Paradigm
* Microsoft Word

### Instructions
* Clone repository wherever you want (e.g. `/`).
* Use only folders/files found in `/vpp`.
* Each folder has been given a name to fit the type of
  element it refers to.
* You'll need to place the appropriate XML template in the
  corresponding section of templates in Visual Paradigm. To
  do this, execute the following steps:
1. go to Doc. Composer in Visual Paradigm and either select
   the fill-in option and open our doc template (in
   __doc_template__ folder as a Doc Base).
2. Go to `./Project` in GitHub repo and open some folder. e.g.The __Project__ folder.
3. On the __Diagram Navigator__ or the __Model Explorer__ click on the corresponding element to the GitHub folder `Name` you opened. For our example it's the __Project__ Element (will be the root of all elements) this will show all templates that refer to __Project__.
4. Execute the following steps
   1. In Visual Paradigm create a new XML template (e.g. by
   duplicating an existing and changing its name and content)
   with the same name as one of the files in the GitHub folder and the
   same content as the corresponding file.
   2. repeat for all files it the folder.
5. Repeat for all folders  in the `/vpp` directory (excluding
   __doc_template__).

* For each of our folders you'll need to add the xml templates
  as described above in the following elements in Visual Paradigm.

* Folder: __Component__, Visual Paradigm: navigate to __Model Explorer__ then find a component. e.g. __User Device__ and then choose __Web Browser__.
* Folder: __Use Case Diagram__, Visual Paradigm: navigate to __Use Case Diagram__ then find a Use Case Diagram e.g. __All Use Cases__.
* Folder: __Actor__, Visual Paradigm: in __Model Explorer__ find an Actor e.g. __Χρήστες__ and then __Απαντών__.
* Folder: __Interaction Diagram__, Visual Paradigm: __Diagram Navigator__ then find a Sequence Diagram e.g. __Answer Questionnaire Sequence__.
* Folder: __Class__, Visual Paradigm: In __Model Explorer__ locate a class e.g. go to __Database Schema__ and then __Questionnaire__.
* Folder: __Use Case__, Visual Paradigm: Find a Use Case e.g. __Model Explorer__ then __Answer Questionnaire__.