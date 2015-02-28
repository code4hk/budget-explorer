# -*- coding: utf-8 -*-
import re


def getCount(numberLiteral):
    numberLiteral = numberLiteral.replace(' ','')
    numberLiteral = numberLiteral.replace(',','')
    return numberLiteral


#handle case like this
#abc
#count ................................ ................................2 489 ........ 2 500 2 500
# but avoid (actual) or (unit)

def concatLastlineIfGood(itemName,lastline):
    m = re.search('\.\.\.',lastline)
    m2 = re.search('\(',lastline)
    if m or m2:
        return itemName
    return lastline.replace('\n','') + itemName

def emptyLine(line):
    m = re.search('[^ \n]',line)
    if m:
        return False
    else:
        return True

head= 121
alloutput = open('extracted/chead'+str(head).zfill(3)+'_all.csv','w')
for year in range(2006,2015):
    inputFileName = '_'.join(['parsed/chead'+str(head).zfill(3),str(year)])+'.txt'
    outputFileName = '_'.join(['extracted/chead'+str(head).zfill(3),str(year)])+'.csv'

    f = open(inputFileName,'r')
    output = open(outputFileName,'w')
    print f
    for line in f:
        print line
        if emptyLine(line):
            continue;
        m = re.search('([^.]+)\.\.\.\.[^\d]+(\d[\d ,.-]+).*',line)
        if m is not None:
            # print "L:"+line
            # print "1:"+m.group(1)
            # print "2:"+m.group(2)
            if m.group(2) is not None:
                numberLiterals = m.group(2).split('  ')
                if len(numberLiterals) <=3:
                    usualLength = len(numberLiterals[-1])
                    #get closest space and split there
                    #most likely 1 234
                    concatNumberLiterals = m.group(2).replace('  ',' ')
                    concatNumberLiterals = re.sub(r"(\d) (\d\d\d)", r"\1\2", concatNumberLiterals)
                    print concatNumberLiterals
                    numberLiterals = concatNumberLiterals.split(' ')
                    numbers = map(getCount, numberLiterals)
                else:
                    numbers = map(getCount, numberLiterals)
            print numbers
            itemName = m.group(1).replace(' ','')
            itemName = concatLastlineIfGood(itemName, lastline)
            output.write(itemName+",")
            output.write(','.join(numbers))
            output.write("\n")

            alloutput.write(str(year)+",")
            alloutput.write(itemName+",")
            alloutput.write(','.join(numbers))
            alloutput.write("\n")
        lastline = line

    output.close()
    outputWritten = open(outputFileName,'r')
    print "output:"
    for line in outputWritten:
        print line


rubbish = ['‡']

alloutput.close()
