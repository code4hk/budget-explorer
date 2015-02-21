#$1 subhead $2 year
curl http://www.budget.gov.hk/$2/chi/pdf/chead$1.pdf > raw/chead$1_$2.pdf
pdf2txt.py -M 30 -W .25 -L .9999999999   raw/chead$1_$2.pdf > parsed/chead$1_$2.txt
