# budget-explorer

###Workflow Overview
1. Retrieve Budget Estimates PDF files from government budget website
2. Convert PDF to text files by running Shell script convert.sh (PDF -> TXT)
3. Extract figures in text files into CSV files by running python script parse.py (TXT -> CSV)
4. Upload CSV file to Google Spreadsheet and cleanse the data
5. Export the data as JSON by Google Spreadsheet JSON API
6. Import JSON Data into Elastic Search Engine



###
Chinese PDFs used for processing

###
1. `convert_batch.sh 021`  will download the PDFs for head 021 (CEO Office) and parse them

###
Download Data (refer to https://code4hk.hackpad.com/CODE4HK-Budget-Hackathon-4Sgfyk51g5m) and extract to raw/csv/


### Env Setup
1.
`cd docker-host-vm`
`vagrant up`

2.
`cd ..`
`vagrant up --provider=docker`
