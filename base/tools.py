import csv
import pandas as pd
import io

class Tools:
    def calculateTotal(self, subjects, testFormat):
        total, percentage, subjectCount = 0, 0, 0
        for subject in subjects:
            try:
                score = int(subject['SCORE'])
                total += score
                subjectCount += 1
            except ValueError:
                break

        if testFormat == 'UT':
            percentage = (total / (40 * subjectCount)) * 100
        else:
            percentage = (total / (100 * subjectCount)) * 100

        percentage = '%.1f' % percentage

        return {"total": total, "perc": percentage}

    def setupMarksheetFromCSV(self, data):
        pass
