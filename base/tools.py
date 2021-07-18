
def calculateTotal(subjects, testFormat):
    total = 0
    percentage = 0
    subjectCount = 0
    for subject in subjects:
        try:
            score = int(subject['SCORE'])
            total += score
            subjectCount += 1
        except ValueError:
            break

    print(subjectCount)
    if testFormat == 'UT':
        percentage = (total / (40 * subjectCount)) * 100
    else:
        percentage = (total / (100 * subjectCount)) * 100

    percentage = '%.1f' % percentage

    return {"total": total, "perc": percentage}
